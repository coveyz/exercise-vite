import connect from 'connect';
import { WebSocketServer, WebSocket } from 'ws';
import { red } from 'picocolors'

import { HMR_PORT } from './constants';


export function createWebSocketServer(server: connect.Server): { send: (msg: string) => void, close: () => void } {
    let wss: WebSocketServer;
    wss = new WebSocketServer({ port: HMR_PORT });

    wss.on('connection', (socket) => {
        socket.send(JSON.stringify({ type: 'connected' }));
    });

    wss.on('error', (e: Error & { code: string }) => {
        if (e.code !== 'EADDRINUSE') {
            console.error(
                red(`Websocket server error:\n${e.stack || e.message}`)
            )
        };
    });

    return {
        send: (payload: Object) => {
            const stringField = JSON.stringify(payload);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(stringField);
                }
            });
        },
        close: () => {
            wss.close();
        }
    };
}