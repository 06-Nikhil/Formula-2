import os
import secrets
import threading
import time
from flask import Flask, send_from_directory, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room

BASE = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=BASE, static_url_path="")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", secrets.token_hex(24))
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
rooms = {}
lock = threading.RLock()

@app.get("/")
def index():
    return send_from_directory(BASE, "index.html")

@app.get("/health")
def health():
    return jsonify(ok=True, rooms=len(rooms))

def public_players(room):
    return [{"id": p["id"], "name": p["name"], "progress": p.get("progress", 0),
             "time": p.get("time", 0), "position": p.get("position", 1),
             "lap": p.get("lap", 1), "finished": p.get("finished", False)}
            for p in room["players"].values()]

def safe_name(value):
    value = "".join(c for c in str(value or "Racer") if c.isalnum() or c in " _-")[:14].strip()
    return value or "Racer"

@socketio.on("create_room")
def create_room(data):
    code = secrets.token_hex(3).upper()[:5]
    with lock:
        rooms[code] = {"players": {}, "started": False,
                       "seed": secrets.randbelow(2_000_000_000) + 1,
                       "laps": 3, "created": time.time()}
        room = rooms[code]
        room["players"][request.sid] = {"id": request.sid, "name": safe_name((data or {}).get("name")),
            "progress": 0, "time": 0, "position": 1, "lap": 1, "finished": False}
    join_room(code)
    emit("room_created", {"code": code, "seed": room["seed"], "players": public_players(room)})
    emit("room_update", {"code": code, "players": public_players(room)}, to=code)

@socketio.on("join_room")
def join_game(data):
    data = data or {}
    code = str(data.get("code", "")).strip().upper()[:5]
    with lock:
        room = rooms.get(code)
        if not room:
            emit("room_error", {"message": "No room found for that code."}); return
        if room["started"]:
            emit("room_error", {"message": "That race has already started."}); return
        if len(room["players"]) >= 6:
            emit("room_error", {"message": "Grid full — six drivers maximum."}); return
        room["players"][request.sid] = {"id": request.sid, "name": safe_name(data.get("name")),
            "progress": 0, "time": 0, "position": 1, "lap": 1, "finished": False}
    join_room(code)
    emit("room_joined", {"code": code, "seed": room["seed"], "players": public_players(room)})
    emit("room_update", {"code": code, "players": public_players(room)}, to=code)

@socketio.on("start_race")
def start_race(data):
    data = data or {}
    code = str(data.get("code", "")).upper()
    with lock:
        room = rooms.get(code)
        if not room or request.sid not in room["players"] or room.get("started"):
            return
        room["started"] = True
        room["seed"] = int(data.get("seed") or room["seed"])
        room["laps"] = max(2, min(5, int(data.get("laps", 3))))
        seed, laps = room["seed"], room["laps"]
    emit("race_start", {"code": code, "seed": seed, "laps": laps}, to=code)

@socketio.on("race_state")
def race_state(data):
    data = data or {}
    code = str(data.get("code", "")).upper()
    with lock:
        room = rooms.get(code)
        if not room or request.sid not in room["players"] or not room["started"]:
            return
        p = room["players"][request.sid]
        try:
            p["progress"] = max(0, min(1, float(data.get("progress", 0))))
            p["time"] = max(0, float(data.get("time", 0)))
            p["position"] = max(1, min(8, int(data.get("position", 1))))
            p["lap"] = max(1, min(6, int(data.get("lap", 1))))
        except (TypeError, ValueError):
            return
        p["finished"] = bool(data.get("finished", False))
        payload = {"code": code, "players": public_players(room)}
    emit("race_snapshot", payload, to=code)
    if p["finished"]:
        emit("race_finished", payload, to=code)

@socketio.on("leave_room")
def leave_room_handler(data):
    code = str((data or {}).get("code", "")).upper()
    leave_room(code)
    with lock:
        room = rooms.get(code)
        if room:
            room["players"].pop(request.sid, None)
            if not room["players"]:
                rooms.pop(code, None)
            else:
                emit("room_update", {"code": code, "players": public_players(room)}, to=code)

@socketio.on("disconnect")
def disconnect():
    with lock:
        for code, room in list(rooms.items()):
            if request.sid in room["players"]:
                room["players"].pop(request.sid, None)
                if not room["players"]:
                    rooms.pop(code, None)
                else:
                    socketio.emit("room_update", {"code": code, "players": public_players(room)}, to=code)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "5000")),
                 debug=False, allow_unsafe_werkzeug=True)
