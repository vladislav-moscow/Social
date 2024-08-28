import { create } from 'zustand';
import axios from 'axios';

// Создаем Zustand store для работы с сообщениями
const useMessageStore = create((set) => ({
	messages: {}, // Объект для хранения сообщений, ключом является ID беседы
	isFetching: false, // Флаг, указывающий на выполнение запроса (загрузка данных)
	error: false, // Переменная для хранения ошибки, если она возникла

	// Метод для получения сообщений по ID беседы
	fetchMessages: async (conversationId) => {
		set({ isFetching: true, error: false }); // Устанавливаем флаг загрузки и сбрасываем ошибку
		try {
			const res = await axios.get(`/api/messages/${conversationId}`); // Выполняем GET-запрос на получение сообщений по ID беседы
			set((state) => ({
				messages: { ...state.messages, [conversationId]: res.data }, // Обновляем состояние, добавляя сообщения для текущей беседы
				isFetching: false, // Сбрасываем флаг загрузки
			}));
		} catch (err) {
			set({ isFetching: false, error: err.message }); // В случае ошибки обновляем состояние, устанавливаем ошибку
		}
	},

	// Метод для отправки нового сообщения
	sendMessage: async (message) => {
		try {
			const res = await axios.post('/api/messages', message); // Выполняем POST-запрос для отправки нового сообщения
			set((state) => ({
				messages: {
					...state.messages,
					[message.conversationId]: [
						...(state.messages[message.conversationId] || []), // Добавляем новое сообщение в список сообщений текущей беседы
						res.data,
					],
				},
			}));
		} catch (err) {
			set({ error: err.message }); // В случае ошибки обновляем состояние и сохраняем ошибку
		}
	},

	// Метод для очистки сообщений (удаления сообщений для определенной беседы)
	clearMessages: (conversationId) => {
		set((state) => {
			const newMessages = { ...state.messages }; // Копируем текущее состояние сообщений
			delete newMessages[conversationId]; // Удаляем сообщения для заданной беседы
			return { messages: newMessages }; // Возвращаем обновленное состояние
		});
	},
}));

export default useMessageStore;
