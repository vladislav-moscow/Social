import { create } from 'zustand';
import axios from 'axios';

const useConversationStore = create((set) => ({
  conversations: [],
  fetchConversations: async (userId) => {
    // Попытка загрузки бесед из локального хранилища
    const savedConversations = localStorage.getItem(`conversations_${userId}`);
    
    if (savedConversations) {
      // Если данные найдены, обновляем состояние
      set({ conversations: JSON.parse(savedConversations) });
    } else {
      // Если данных нет, выполняем запрос на сервер
      try {
        const res = await axios.get(`/api/conversations/${userId}`);
        set({ conversations: res.data });
        // Сохраняем данные в локальное хранилище
        localStorage.setItem(`conversations_${userId}`, JSON.stringify(res.data));
      } catch (err) {
        console.log(err);
      }
    }
  },
  clearConversations: (userId) => {
    // Очистка состояния и локального хранилища
    set({ conversations: [] });
    localStorage.removeItem(`conversations_${userId}`);
  }
}));

export default useConversationStore;