import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectWebSocket = (userToken, onMessageReceived) => {
    if (!userToken) {
        console.error("WebSocket 연결 실패: 토큰이 없습니다.");
        return;
    }

    const socket = new SockJS(`http://10.5.5.4/ws-stomp?token=${userToken}`);

    stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: { Authorization: `Bearer ${userToken}` },
        debug: (str) => console.log('[STOMP DEBUG]', str),
        reconnectDelay: 5000, // 끊어지면 5초 뒤 재연결
        onConnect: () => {
            console.log('WebSocket Connected');

            // 사용자 알람 구독
            stompClient.subscribe('/user/queue/notify', (msg) => {
                try {
                    const alert = JSON.parse(msg.body);
                    onMessageReceived(alert); // React 상태로 전달
                } catch (err) {
                    console.error('메시지 처리 오류', err);
                }
            });
        },
        onStompError: (frame) => {
            console.error('STOMP ERROR:', frame);
        }
    });

    stompClient.activate();
};

// 메시지 전송 함수
export const sendMessage = (destination, payload) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination,
            body: JSON.stringify(payload)
        });
    } else {
        console.warn('WebSocket이 연결되지 않았습니다.');
    }
};
