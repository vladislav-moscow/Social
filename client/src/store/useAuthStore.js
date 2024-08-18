// useAuthStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

// Создайте Zustand store с помощью middleware для отладки
const useAuthStore = create(
	devtools((set) => ({
		user: JSON.parse(localStorage.getItem('user')) || null,
		isFetching: false,
		error: false,

		// Действия для управления состоянием
		loginStart: () => set({ isFetching: true, error: false }),
		loginSuccess: (user) => {
			localStorage.setItem('user', JSON.stringify(user));
			set({ user, isFetching: false, error: false });
		},
		loginFailure: () => set({ isFetching: false, error: true }),
		follow: (userId) =>
			set((state) => ({
				user: {
					...state.user,
					followings: [...state.user.followings, userId],
				},
			})),
		unfollow: (userId) =>
			set((state) => ({
				user: {
					...state.user,
					followings: state.user.followings.filter(
						(following) => following !== userId
					),
				},
			})),

		// Асинхронная функция для входа
		loginCall: async (userCredential) => {
			set({ isFetching: true, error: false });
			try {
				const res = await axios.post('/api/auth/login', userCredential);
				set({ user: res.data, isFetching: false, error: false });
				localStorage.setItem('user', JSON.stringify(res.data));
			} catch (err) {
				set({ isFetching: false, error: true });
			}
		},
	}))
);

export default useAuthStore;
