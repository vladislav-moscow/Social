// useAuthStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

/**
 * Zustand store для управления состоянием аутентификации пользователей.
 * Включает действия для входа, регистрации, подписок и выхода из системы.
 */
const useAuthStore = create(
	devtools((set) => ({
		user: JSON.parse(localStorage.getItem('user')) || null,
		isFetching: false,
		error: false,

		/**
		 * Начало процесса аутентификации (вход в систему).
		 * Устанавливает состояние загрузки и сбрасывает ошибки.
		 */
		loginStart: () => set({ isFetching: true, error: false }),
		/**
		 * Успешный вход в систему.
		 * @param {Object} user - Данные пользователя, полученные с сервера.
		 * Сохраняет пользователя в состоянии и localStorage.
		 */

		loginSuccess: (user) => {
			localStorage.setItem('user', JSON.stringify(user));
			set({ user, isFetching: false, error: false });
		},

		/**
		 * Неудачный вход в систему.
		 * Сбрасывает состояние загрузки и устанавливает ошибку.
		 */
		loginFailure: () => set({ isFetching: false, error: true }),

		/**
		 * Асинхронная функция для выполнения входа в систему.
		 * @param {Object} userCredential - Объект с учетными данными пользователя (email, password).
		 * Выполняет запрос на сервер и сохраняет данные пользователя при успешной аутентификации.
		 */
		loginCall: async (userCredential) => {
			set({ isFetching: true, error: false });
			try {
				const res = await axios.post('/api/auth/login', userCredential);
				set({ user: res.data, isFetching: false, error: false });
				localStorage.setItem('user', JSON.stringify(res.data));
			} catch (err) {
				// Здесь обрабатываем сообщение об ошибке, если оно есть
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Неверный пароль',
				});
			}
		},

		/**
		 * Асинхронная функция для регистрации нового пользователя.
		 * @param {Object} userData - Объект с данными для регистрации (username, email, password).
		 * Выполняет запрос на регистрацию пользователя.
		 */
		registerCall: async (userData) => {
			set({ isFetching: true, error: false });
			try {
				await axios.post('/api/auth/register', userData);
				set({ isFetching: false, error: false });
				// Вы можете добавить автоматический вход после регистрации, если это необходимо:
				const res = await axios.post('/api/auth/login', {
					email: userData.email,
					password: userData.password,
				});
				set({ user: res.data, isFetching: false, error: false });
				localStorage.setItem('user', JSON.stringify(res.data));
			} catch (err) {
				set({ isFetching: false, error: true });
			}
		},

		/**
		 * Очистка ошибок.
		 * Сбрасывает состояние ошибок.
		 */
		clearError: () => set({ error: false }),

		/**
		 * Действие для выхода из системы.
		 * Очищает данные пользователя из состояния и localStorage.
		 */
		logout: () => {
			localStorage.removeItem('user');
			set({ user: null, isFetching: false, error: false });
		},

		/**
		 * Добавление пользователя в список подписок (follow).
		 * @param {string} userId - ID пользователя, на которого подписываются.
		 */
		follow: (userId) =>
			set((state) => ({
				user: {
					...state.user,
					followings: [...state.user.followings, userId],
				},
			})),

		/**
		 * Удаление пользователя из списка подписок (unfollow).
		 * @param {string} userId - ID пользователя, от которого отписываются.
		 */
		unfollow: (userId) =>
			set((state) => ({
				user: {
					...state.user,
					followings: state.user.followings.filter(
						(following) => following !== userId
					),
				},
			})),
	}))
);

export default useAuthStore;
