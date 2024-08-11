import { create } from 'zustand';
import { Users } from '../Data';

// Создаем Zustand store
export const useUserStore = create((set, get) => ({
	users: Users, // Инициализируем пользователей из файла Data.js
	setUsers: (users) => set({ users }), // Функция для установки списка пользователей

	// Функция для поиска пользователя по id
	getUserById: (id) => get().users.find((user) => user.id === id) || null,
}));
