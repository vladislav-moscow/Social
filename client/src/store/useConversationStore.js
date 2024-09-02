import { create } from 'zustand';
import axios from 'axios';

const useConversationStore = create((set, get) => ({
	conversations: [],
	currentChat: null,

	/**
	 * Получение всех бесед для пользователя и сохранение их в состояние.
	 * @param {string} userId - ID текущего пользователя
	 */
	fetchConversations: async (userId) => {
		const savedConversations = localStorage.getItem('conversations');
		if (savedConversations) {
			set({ conversations: JSON.parse(savedConversations) });
		} else {
			try {
				const res = await axios.get(`/api/conversations/${userId}`);
				set({ conversations: res.data });
				localStorage.setItem('conversations', JSON.stringify(res.data));
			} catch (err) {
				console.log(err);
			}
		}
	},

	/**
     * Создание новой беседы между текущим пользователем и выбранным другом.
     * @param {string} userId - ID текущего пользователя
     * @param {string} friendId - ID друга
     */
	createConversation: async (userId, friendId) => {
		try {
				const res = await axios.post('/api/conversations', {
						senderId: userId,
						receiverId: friendId,
				});
				// Получаем текущее состояние бесед
				const currentConversations = get().conversations;
				// Обновляем состояние и localStorage
				set({
						conversations: [...currentConversations, res.data],
						currentChat: res.data,
				});
				localStorage.setItem('conversations', JSON.stringify([...currentConversations, res.data]));
				localStorage.setItem('currentChat', res.data._id);
				return res.data;
		} catch (err) {
				console.log(err);
		}
},

/**
 * Получение беседы между двумя пользователями
 * @param {string} firstUserId - ID первого пользователя
 * @param {string} secondUserId - ID второго пользователя
 * @returns {Object|null} - Возвращает найденную беседу или null
 */
getConversation: async (firstUserId, secondUserId) => {
		try {
				const res = await axios.get(`/api/conversations/find/${firstUserId}/${secondUserId}`);
				return res.data || null;
		} catch (err) {
				console.log(err);
				return null;
		}
},

	/**
	 * Сохранение выбранной беседы в локальное хранилище
	 * @param {string} userId - ID текущего пользователя
	 * @param {Object} chat - Объект текущей беседы
	 */
	saveCurrentChat: (userId, chat) => {
		set({ currentChat: chat });
		localStorage.setItem('currentChat', chat._id);
	},

	/**
	 * Загрузка выбранной беседы из локального хранилища
	 * @param {string} userId - ID текущего пользователя
	 */
	loadCurrentChat: (userId) => {
		const savedChatId = localStorage.getItem('currentChat');
		return savedChatId || null;
	},

	clearConversations: () => {
		set({ conversations: [], currentChat: null });
		localStorage.removeItem('conversations');
		localStorage.removeItem('currentChat');
	},
}));

export default useConversationStore;
