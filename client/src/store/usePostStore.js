import { create } from 'zustand';
import { Posts } from '../Data'; // Импортируем начальные данные постов

// Создаем Zustand store для постов
export const usePostStore = create((set) => ({
	posts: Posts, // Инициализируем посты из файла Data.js
	setPosts: (newPosts) => set({ posts: newPosts }), // Функция для обновления постов
}));
