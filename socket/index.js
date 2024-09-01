import { Server } from 'socket.io';

// Создание экземпляра сервера Socket.IO
const io = new Server(8900, {
	cors: {
		origin: 'http://localhost:5173', // Разрешаем CORS для указанного источника
	},
});

// Массив для хранения пользователей и их сокетов
let users = [];

/**
 * Добавляет пользователя в массив пользователей.
 * @param {string} userId - ID пользователя.
 * @param {string} socketId - ID сокета пользователя.
 */
const addUser = (userId, socketId) => {
	// Проверяем, существует ли пользователь с таким ID, если нет, добавляем его
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

/**
 * Удаляет пользователя по ID сокета.
 * @param {string} socketId - ID сокета пользователя, которого нужно удалить.
 */
const removeUser = (socketId) => {
	// Фильтруем массив пользователей, исключая пользователя с указанным ID сокета
	users = users.filter((user) => user.socketId !== socketId);
};

/**
 * Находит пользователя по его ID.
 * @param {string} userId - ID пользователя, которого нужно найти.
 * @returns {Object|undefined} - Возвращает объект пользователя с соответствующим ID или undefined, если пользователь не найден.
 */
const getUser = (userId) => {
	return users.find((user) => user.userId === userId);
};

// Обрабатываем подключение нового сокета
io.on('connection', (socket) => {
	// При подключении нового пользователя
	console.log('a user connected.');

	/**
	 * Обрабатывает добавление нового пользователя.
	 * @param {string} userId - ID пользователя, который подключился.
	 */
	socket.on('addUser', (userId) => {
		addUser(userId, socket.id);
		io.emit('getUsers', users); // Отправляем обновленный список пользователей всем клиентам
	});

	/**
	 * Обрабатывает отправку сообщения от одного пользователя другому.
	 * @param {Object} data - Данные сообщения.
	 * @param {string} data.senderId - ID отправителя.
	 * @param {string} data.receiverId - ID получателя.
	 * @param {string} data.text - Текст сообщения.
	 */
	socket.on('sendMessage', ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
		if (user) {
			io.to(user.socketId).emit('getMessage', {
				senderId,
				text,
			});
		} else {
			console.error(`User with ID ${receiverId} not found`); // Выводим ошибку в консоль, если пользователь не найден
		}
	});

	// При отключении пользователя
	socket.on('disconnect', () => {
		console.log('a user disconnected!');
		removeUser(socket.id); // Удаляем пользователя по ID сокета
		io.emit('getUsers', users); // Отправляем обновленный список пользователей всем клиентам
	});
});
