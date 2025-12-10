import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectWebSocket = (userToken, userId, onMessageReceived) => {
    if (!userToken) return

    const socket = new SockJS(`http://10.5.5.4/ws-stomp?token=${userToken}`);

    stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: { Authorization: `Bearer ${userToken}` },
        debug: (str) => console.log('[STOMP DEBUG]', str),
        reconnectDelay: 5000,
        onConnect: () => {
            stompClient.subscribe("/user/queue/notify", (msg) => {
                try {
                    const alert = JSON.parse(msg.body);
                    onMessageReceived(alert);
                } catch (err) { }
            });

            stompClient.publish({
                destination: "/pub/notify/init",
                body: userId
            });
        },
    });

    stompClient.activate();
};

export const sendMessage = (destination, payload) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination,
            body: JSON.stringify(payload)
        });
    }
};
