// socket.js
import { io } from 'socket.io-client';

/**
 * Создание подключения к серверу WebSocket.
 * 
 * Этот экземпляр используется для обмена данными в реальном времени между клиентом и сервером через WebSocket.
 * Подключение происходит к серверу, запущенному на `ws://localhost:8900`.
 * 
 * @constant {Socket} socket - Экземпляр подключения WebSocket.
 */
const socket = io('ws://localhost:8900');

export default socket;
