
// Apex Rush backend: Telegram Stars + live rooms + Inline Mode
// Install: npm install ws
// Environment variables: BOT_TOKEN, PORT

const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const T = process.env.BOT_TOKEN;
const DB = 'owned.json';

if (!T) throw new Error('BOT_TOKEN environment variable is missing');

const PRICE = { ph: 50, in: 100, au: 150, ax: 250 };
const own = fs.existsSync(DB)
  ? JSON.parse(fs.readFileSync(DB))
  : {};

const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${T}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => r.json());

function uid(init) {
  try {
    const p = new URLSearchParams(init);
    const h = p.get('hash');
    p.delete('hash');

    const s = [...p]
      .map(([k, v]) => k + '=' + v)
      .sort()
      .join('\n');

    const k = crypto
      .createHmac('sha256', 'WebAppData')
      .update(T)
      .digest();

    return crypto
      .createHmac('sha256', k)
      .update(s)
      .digest('hex') === h
        ? JSON.parse(p.get('user')).id
        : null;
  } catch {
    return null;
  }
}

const srv = http.createServer(async (q, s) => {
  const u = new URL(q.url, 'http://x');
  const id = uid(u.searchParams.get('init') || '');

  s.setHeader('access-control-allow-origin', '*');
  s.setHeader('content-type', 'application/json');

  try {
    if (u.pathname === '/invoice' && id && PRICE[u.searchParams.get('car')]) {
      const c = u.searchParams.get('car');

      const r = await api('createInvoiceLink', {
        title: 'Apex Rush car: ' + c.toUpperCase(),
        description: 'Unlock this car forever',
        payload: id + ':' + c,
        currency: 'XTR',
        prices: [{ label: c, amount: PRICE[c] }]
      });

      return s.end(JSON.stringify({ link: r.result }));
    }

    if (u.pathname === '/owned' && id) {
      return s.end(JSON.stringify({ cars: own[id] || [] }));
    }

    if (u.pathname === '/tg' && q.method === 'POST') {
      let b = '';
      for await (const d of q) b += d;

      const x = JSON.parse(b);

      // TELEGRAM INLINE MODE
      if (x.inline_query) {
        const result = {
          type: 'article',
          id: 'apex-rush',
          title: '🏎️ Apex Rush',
          description: 'Race, beat lap records and challenge your friends!',

          input_message_content: {
            message_text:
              '🏎️ APEX RUSH\n\n' +
              'Think you can dominate the track?\n\n' +
              'Race against the clock, chase your fastest lap ' +
              'and challenge your friends!'
          },

          reply_markup: {
            inline_keyboard: [[
              {
                text: '🏁 PLAY NOW',
                url: 'https://t.me/Formula2game_bot/Formula2'
              }
            ]]
          }
        };

        await api('answerInlineQuery', {
          inline_query_id: x.inline_query.id,
          results: [result],
          cache_time: 0,
          is_personal: true
        });

        return s.end('{}');
      }

      // STARS PAYMENT
      if (x.pre_checkout_query) {
        await api('answerPreCheckoutQuery', {
          pre_checkout_query_id: x.pre_checkout_query.id,
          ok: true
        });
      }

      const pay = x.message && x.message.successful_payment;

      if (pay) {
        const [i, c] = pay.invoice_payload.split(':');
        own[i] = own[i] || [];
        own[i].push(c);
        fs.writeFileSync(DB, JSON.stringify(own));
      }

      return s.end('{}');
    }

    s.statusCode = 404;
    return s.end('{}');

  } catch (e) {
    console.error(e);
    s.statusCode = 500;
    return s.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

// LIVE MULTIPLAYER ROOMS
const rooms = {};
const wss = new WebSocketServer({ server: srv, path: '/ws' });

wss.on('connection', (ws, q) => {
  const r = new URL(q.url, 'http://x')
    .searchParams.get('room') || 'x';

  const id = Math.random().toString(36).slice(2, 9);
  const R = rooms[r] = rooms[r] || new Map();
  const me = { ws, st: {} };

  ws.send(JSON.stringify({ t: 'hi', id }));

  R.forEach((c, i) => {
    ws.send(JSON.stringify({ t: 'p', f: i, d: c.st }));
  });

  R.set(id, me);

  const all = m => R.forEach(c => {
    if (c.ws.readyState === 1) {
      c.ws.send(JSON.stringify(m));
    }
  });

  ws.on('message', d => {
    try {
      const p = JSON.parse(d);
      Object.assign(me.st, p);
      all({ t: 'p', f: id, d: p });
    } catch (e) {}
  });

  ws.on('close', () => {
    R.delete(id);
    all({ t: 'l', f: id });

    if (!R.size) delete rooms[r];
  });
});

srv.listen(process.env.PORT || 8080, () => {
  console.log('Apex Rush server running');
});
