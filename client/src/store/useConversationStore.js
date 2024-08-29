import { create } from 'zustand';
import axios from 'axios';

const useConversationStore = create((set) => ({
	conversations: [],
	currentChat: null,

	// Получение бесед с сохранением в локальном хранилище
	fetchConversations: async (userId) => {
		const savedConversations = localStorage.getItem(`conversations`);

		if (savedConversations) {
			set({ conversations: JSON.parse(savedConversations) });
		} else {
			try {
				const res = await axios.get(`/api/conversations/${userId}`);
				set({ conversations: res.data });
				localStorage.setItem(
					`conversations`,
					JSON.stringify(res.data)
				);
			} catch (err) {
				console.log(err);
			}
		}
	},

	// Сохранение выбранной беседы в локальное хранилище
	saveCurrentChat: (userId, chat) => {
		set({ currentChat: chat });
		localStorage.setItem(`currentChat`, chat._id);
	},

	// Загрузка выбранной беседы из локального хранилища
	loadCurrentChat: (userId) => {
		const savedChatId = localStorage.getItem(`currentChat`);
		return savedChatId || null;
	},

	clearConversations: (userId) => {
		set({ conversations: [], currentChat: null });
		localStorage.removeItem(`conversations`);
		localStorage.removeItem(`currentChat`);
	},
}));

export default useConversationStore;
