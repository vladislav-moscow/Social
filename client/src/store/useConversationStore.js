import { create } from 'zustand';
import axios from 'axios';

/**
 * Zustand store для управления состоянием бесед (чатов).
 * Обрабатывает действия по загрузке бесед, созданию новых бесед, получению бесед, сохранению и загрузке текущей беседы, а также очистке всех бесед.
 *
 * @typedef {Object} Conversation
 * @property {string} _id - Идентификатор беседы.
 * @property {Array<string>} members - Массив ID участников беседы.
 * @property {Array<Object>} messages - Массив сообщений в беседе.
 *
 * @typedef {Object} ConversationStore
 * @property {Array<Conversation>} conversations - Список всех бесед.
 * @property {Conversation|null} currentChat - Текущая активная беседа.
 * @property {Function} fetchConversations - Получение всех бесед для пользователя и сохранение их в состояние.
 * @property {Function} createConversation - Создание новой беседы между текущим пользователем и выбранным другом.
 * @property {Function} getConversation - Получение беседы между двумя пользователями.
 * @property {Function} saveCurrentChat - Сохранение выбранной беседы в локальное хранилище.
 * @property {Function} loadCurrentChat - Загрузка выбранной беседы из локального хранилища.
 * @property {Function} clearConversations - Очистка всех бесед и текущей беседы.
 */

const useConversationStore = create((set, get) => ({
	conversations: [], // Список всех бесед.
	currentChat: null, // Текущая активная беседа.

	/**
	 * Получение всех бесед для пользователя и сохранение их в состояние.
	 * Сначала пытается получить беседы из localStorage, если их нет, делает запрос на сервер.
	 * @param {string} userId - ID текущего пользователя
	 */
	fetchConversations: async (userId) => {
		const savedConversations = localStorage.getItem('conversations');
		if (savedConversations) {
			// Если беседы уже сохранены в localStorage, загружаем их в состояние.
			set({ conversations: JSON.parse(savedConversations) });
		} else {
			try {
				// Если беседы не найдены в localStorage, делаем запрос на сервер.
				const res = await axios.get(`/api/conversations/${userId}`);
				set({ conversations: res.data });
				localStorage.setItem('conversations', JSON.stringify(res.data)); // Сохраняем беседы в localStorage.
			} catch (err) {
				console.log(err); // Обработка ошибок при запросе.
			}
		}
	},

	/**
	 * Создание новой беседы между текущим пользователем и выбранным другом.
	 * Добавляет новую беседу в состояние и сохраняет ее в localStorage.
	 * @param {string} userId - ID текущего пользователя
	 * @param {string} friendId - ID друга
	 */
	createConversation: async (userId, friendId) => {
		try {
			// Делаем запрос на сервер для создания новой беседы.
			const res = await axios.post('/api/conversations', {
				senderId: userId,
				receiverId: friendId,
			});
			// Получаем текущее состояние бесед.
			const currentConversations = get().conversations;
			// Обновляем состояние и localStorage с новой беседой.
			set({
				conversations: [...currentConversations, res.data],
				currentChat: res.data,
			});
			localStorage.setItem(
				'conversations',
				JSON.stringify([...currentConversations, res.data])
			);
			localStorage.setItem('currentChat', res.data._id);
			return res.data;
		} catch (err) {
			console.log(err); // Обработка ошибок при запросе.
		}
	},

	/**
	 * Получение беседы между двумя пользователями.
	 * @param {string} firstUserId - ID первого пользователя
	 * @param {string} secondUserId - ID второго пользователя
	 * @returns {Object|null} - Возвращает найденную беседу или null, если беседа не найдена.
	 */
	getConversation: async (firstUserId, secondUserId) => {
		try {
			// Делаем запрос на сервер для получения беседы между двумя пользователями.
			const res = await axios.get(
				`/api/conversations/find/${firstUserId}/${secondUserId}`
			);
			return res.data || null;
		} catch (err) {
			console.log(err); // Обработка ошибок при запросе.
			return null;
		}
	},

	/**
	 * Сохранение выбранной беседы в локальное хранилище.
	 * @param {string} userId - ID текущего пользователя
	 * @param {Object} chat - Объект текущей беседы
	 */
	saveCurrentChat: (userId, chat) => {
		set({ currentChat: chat });
		localStorage.setItem('currentChat', chat._id); // Сохраняем ID текущей беседы в localStorage.
	},

	/**
	 * Загрузка выбранной беседы из локального хранилища.
	 * @param {string} userId - ID текущего пользователя
	 * @returns {string|null} - Возвращает ID текущей беседы или null, если беседа не найдена.
	 */
	loadCurrentChat: (userId) => {
		const savedChatId = localStorage.getItem('currentChat');
		return savedChatId || null;
	},

	/**
	 * Очистка всех бесед и текущей беседы.
	 * Удаляет данные из состояния и localStorage.
	 */
	clearConversations: () => {
		set({ conversations: [], currentChat: null });
		localStorage.removeItem('conversations'); // Удаляем данные бесед из localStorage.
		localStorage.removeItem('currentChat'); // Удаляем данные текущей беседы из localStorage.
	},
}));

export default useConversationStore;
