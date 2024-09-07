import { create } from 'zustand';
import axios from 'axios';

/**
 * Zustand store для управления состоянием сообщений.
 * Хранит сообщения по беседам, а также обрабатывает операции получения, отправки и обновления сообщений.
 *
 * @typedef {Object} Message
 * @property {string} _id - Идентификатор сообщения.
 * @property {string} conversationId - Идентификатор беседы, к которой относится сообщение.
 * @property {string} senderId - Идентификатор отправителя сообщения.
 * @property {string} text - Текст сообщения.
 * @property {Date} createdAt - Дата и время создания сообщения.
 *
 * @typedef {Object} MessageStore
 * @property {Object.<string, Message[]>} messages - Объект, где ключом является ID беседы, а значением - массив сообщений для этой беседы.
 * @property {boolean} isFetching - Флаг, указывающий на выполнение запроса.
 * @property {boolean|string} error - Переменная для хранения сообщения об ошибке, если она возникла.
 * @property {Function} fetchMessages - Получение сообщений для определенной беседы.
 * @property {Function} sendMessage - Отправка нового сообщения.
 * @property {Function} updateMessages - Обновление сообщений через WebSocket.
 * @property {Function} clearMessages - Очистка сообщений для определенной беседы.
 */
const useMessageStore = create((set) => ({
	messages: {}, // Объект для хранения сообщений, ключом является ID беседы
	isFetching: false, // Флаг, указывающий на выполнение запроса (загрузка данных)
	error: false, // Переменная для хранения ошибки, если она возникла

	/**
	 * Получение сообщений для определенной беседы по ее ID.
	 * Устанавливает флаг загрузки и сбрасывает ошибки перед запросом.
	 * После получения сообщений обновляет состояние и сбрасывает флаг загрузки.
	 * @param {string} conversationId - ID беседы, для которой нужно получить сообщения.
	 */
	fetchMessages: async (conversationId) => {
		set({ isFetching: true, error: false }); // Устанавливаем флаг загрузки и сбрасываем ошибку
		try {
			// Выполняем GET-запрос для получения сообщений по ID беседы
			const res = await axios.get(`/api/messages/${conversationId}`);
			// Обновляем состояние, добавляя сообщения для текущей беседы
			set((state) => ({
				messages: { ...state.messages, [conversationId]: res.data },
				isFetching: false, // Сбрасываем флаг загрузки
			}));
		} catch (err) {
			set({ isFetching: false, error: err.message }); // В случае ошибки обновляем состояние и устанавливаем ошибку
		}
	},

	/**
	 * Отправка нового сообщения.
	 * Выполняет POST-запрос для добавления нового сообщения и обновляет состояние.
	 * @param {Message} message - Объект сообщения, который нужно отправить.
	 */
	sendMessage: async (message) => {
		try {
			// Выполняем POST-запрос для отправки нового сообщения
			const res = await axios.post('/api/messages', message);
			// Обновляем состояние, добавляя новое сообщение в список сообщений текущей беседы
			set((state) => ({
				messages: {
					...state.messages,
					[message.conversationId]: [
						...(state.messages[message.conversationId] || []),
						res.data,
					],
				},
			}));
		} catch (err) {
			set({ error: err.message }); // В случае ошибки обновляем состояние и сохраняем ошибку
		}
	},

	/**
	 * Обновление сообщений через WebSocket.
	 * Добавляет новое сообщение в состояние для указанной беседы.
	 * @param {string} conversationId - ID беседы, в которую нужно добавить сообщение.
	 * @param {Message} message - Объект сообщения, которое нужно добавить.
	 */
	updateMessages: (conversationId, message) => {
		set((state) => ({
			messages: {
				...state.messages,
				[conversationId]: [...(state.messages[conversationId] || []), message],
			},
		}));
	},

	/**
	 * Очистка сообщений для определенной беседы.
	 * Удаляет все сообщения для указанной беседы из состояния.
	 * @param {string} conversationId - ID беседы, для которой нужно удалить сообщения.
	 */
	clearMessages: (conversationId) => {
		set((state) => {
			// Копируем текущее состояние сообщений
			const newMessages = { ...state.messages };
			// Удаляем сообщения для заданной беседы
			delete newMessages[conversationId];
			// Возвращаем обновленное состояние
			return { messages: newMessages };
		});
	},
}));

export default useMessageStore;
