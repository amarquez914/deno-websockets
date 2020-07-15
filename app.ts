import { serve } from "https://deno.land/std/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
  acceptable
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

let sockets = new Map<string, WebSocket>();

async function handleWs(sock: WebSocket) {
  console.log("socket connected!");
  try {
        // store sockets in a map
        const uid = v4.generate();
        sockets.set(uid, sock);

    for await (const ev of sock) {
      if (typeof ev === "string") {
        // text message
        console.log("ws:Text", ev);
        sockets.forEach((ws: WebSocket) => ws.send(ev))
        // await sock.send(ev);
      } else if (ev instanceof Uint8Array) {
        // binary message
        console.log("ws:Binary", ev);
      } else if (isWebSocketPingEvent(ev)) {
        const [, body] = ev;
        // ping
        console.log("ws:Ping", body);
      } else if (isWebSocketCloseEvent(ev)) {
        // close
        sockets.delete(uid);
        const { code, reason } = ev;
        console.log("ws:Close", code, reason);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}

const server = serve({ port: 3500, hostname: "localhost" });

console.log('server', server);
for await (const req of server) {
    
  if (req.url === '/') {
    req.respond({
      status: 200,
      body: await Deno.open('./public/index.html')
    })
  }

  if (req.url.includes('.js')) {
    const path = req.url.replace('/', '');
    req.respond({
      status:200,
      body: await Deno.open(`./public/${path}`)
    })
  }

  if (req.url === '/ws') {
    if (acceptable(req)) {
      const { conn, r: bufReader, w: bufWriter, headers } = req;
      acceptWebSocket({
        conn,
        bufReader,
        bufWriter,
        headers,
      })
      .then(handleWs)
      .catch(async (err: any) => {
        console.error(`failed to accept websocket: ${err}`);
        await req.respond({ status: 400 });
      });
    }
  }
}
