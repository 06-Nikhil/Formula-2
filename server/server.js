// Apex Rush backend: Telegram Stars shop + live race rooms.
// Setup: npm i ws · env BOT_TOKEN, PORT · HTTPS reverse proxy · then
// https://api.telegram.org/bot<TOKEN>/setWebhook?url=<PUBLIC_URL>/tg
// In the game set API='<PUBLIC_URL>'. Prices (Stars) below must match the game.
const http=require('http'),fs=require('fs'),crypto=require('crypto'),{WebSocketServer}=require('ws'),T=process.env.BOT_TOKEN,DB='owned.json';
const PRICE={ph:50,in:100,au:150,ax:250},own=fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB)):{};
const api=(m,b)=>fetch(`https://api.telegram.org/bot${T}/${m}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
function uid(init){const p=new URLSearchParams(init),h=p.get('hash');p.delete('hash');const s=[...p].map(([k,v])=>k+'='+v).sort().join('\n'),k=crypto.createHmac('sha256','WebAppData').update(T).digest();return crypto.createHmac('sha256',k).update(s).digest('hex')==h?JSON.parse(p.get('user')).id:null}
const srv=http.createServer(async(q,s)=>{const u=new URL(q.url,'http://x'),id=uid(u.searchParams.get('init')||'');s.setHeader('access-control-allow-origin','*');s.setHeader('content-type','application/json');
 if(u.pathname=='/invoice'&&id&&PRICE[u.searchParams.get('car')]){const c=u.searchParams.get('car'),r=await api('createInvoiceLink',{title:'Apex Rush car: '+c.toUpperCase(),description:'Unlock this car forever',payload:id+':'+c,currency:'XTR',prices:[{label:c,amount:PRICE[c]}]});return s.end(JSON.stringify({link:r.result}))}
 if(u.pathname=='/owned'&&id)return s.end(JSON.stringify({cars:own[id]||[]}));
 if(u.pathname=='/tg'&&q.method=='POST'){let b='';for await(const d of q)b+=d;const x=JSON.parse(b);if(x.pre_checkout_query)await api('answerPreCheckoutQuery',{pre_checkout_query_id:x.pre_checkout_query.id,ok:true});const pay=x.message&&x.message.successful_payment;if(pay){const[i,c]=pay.invoice_payload.split(':');(own[i]=own[i]||[]).push(c);fs.writeFileSync(DB,JSON.stringify(own))}return s.end('{}')}
 s.statusCode=404;s.end('{}')});
const rooms={},wss=new WebSocketServer({server:srv,path:'/ws'});
wss.on('connection',(ws,q)=>{const r=new URL(q.url,'http://x').searchParams.get('room')||'x',id=Math.random().toString(36).slice(2,9),R=rooms[r]=rooms[r]||new Map(),me={ws,st:{}};
 ws.send(JSON.stringify({t:'hi',id}));R.forEach((c,i)=>ws.send(JSON.stringify({t:'p',f:i,d:c.st})));R.set(id,me);
 const all=m=>R.forEach(c=>c.ws.readyState==1&&c.ws.send(JSON.stringify(m)));
 ws.on('message',d=>{try{const p=JSON.parse(d);Object.assign(me.st,p);all({t:'p',f:id,d:p})}catch(e){}});
 ws.on('close',()=>{R.delete(id);all({t:'l',f:id});if(!R.size)delete rooms[r]})});
srv.listen(process.env.PORT||8080);
