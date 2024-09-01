import { create } from 'zustand';
import axios from 'axios';

const useConversationStore = create((set) => ({
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
			set((state) => ({
				conversations: [...state.conversations, res.data],
				currentChat: res.data,
			}));
			localStorage.setItem('currentChat', res.data._id);
			return res.data;
		} catch (err) {
			console.log(err);
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
