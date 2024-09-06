// useAuthStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';


/**
 * Zustand store для управления состоянием аутентификации пользователей.
 * Включает действия для входа, регистрации, подписок и выхода из системы.
 */
const useAuthStore = create(
	devtools((set, get) => ({
		// Начальное состояние стора
		user: JSON.parse(localStorage.getItem('user')) || null, // Инициализируем состояние пользователя из localStorage или null, если пользователь не аутентифицирован.
		isFetching: false, // Флаг загрузки данных, чтобы отслеживать состояние загрузки.
		error: false, // Флаг ошибки, чтобы отслеживать состояние ошибок.
		onlineUsers: [],


		// ===== Селекторы =====

		/**
		 * Получает текущего пользователя из состояния.
		 * @returns {Object|null} - Данные пользователя или null, если пользователь не аутентифицирован.
		 */
		getUser: () => get().user, // Возвращает текущего пользователя из состояния.

		/**
		 * Проверяет, аутентифицирован ли пользователь.
		 * @returns {boolean} - true, если пользователь аутентифицирован, иначе false.
		 */
		isAuthenticated: () => !!get().user, // Проверяет, аутентифицирован ли пользователь, и возвращает boolean.

		/**
		 * Получает конкретное свойство пользователя.
		 * @param {string} key - Ключ свойства, которое необходимо получить.
		 * @returns {*} - Значение свойства или undefined, если пользователь не аутентифицирован или свойство не существует.
		 */
		getUserProperty: (key) => get().user?.[key], // Получает значение конкретного свойства пользователя.

		// ===== Действия =====

		/**
		 * Начало процесса аутентификации (вход в систему).
		 * Устанавливает состояние загрузки и сбрасывает ошибки.
		 */
		loginStart: () => set({ isFetching: true, error: false }), // Устанавливает флаги isFetching и error перед началом процесса аутентификации.

		/**
		 * Успешный вход в систему.
		 * @param {Object} user - Данные пользователя, полученные с сервера.
		 * Сохраняет пользователя в состоянии и localStorage.
		 */
		loginSuccess: (user) => {
			localStorage.setItem('user', JSON.stringify(user)); // Сохраняем данные пользователя в localStorage.
			set({ user, isFetching: false, error: false }); // Обновляем состояние с данными пользователя и сбрасываем флаги загрузки и ошибок.
		},

		/**
		 * Неудачный вход в систему.
		 * Сбрасывает состояние загрузки и устанавливает ошибку.
		 */
		loginFailure: () => set({ isFetching: false, error: true }), // Сбрасываем флаг загрузки и устанавливаем флаг ошибки в случае неудачного входа.

		/**
		 * Асинхронная функция для выполнения входа в систему.
		 * @param {Object} userCredential - Объект с учетными данными пользователя (email, password).
		 * Выполняет запрос на сервер и сохраняет данные пользователя при успешной аутентификации.
		 */
		loginCall: async (userCredential) => {
			set({ isFetching: true, error: false }); // Устанавливаем состояние загрузки перед запросом.
			try {
				// Выполняем запрос на сервер для аутентификации пользователя.
				const res = await axios.post('/api/auth/login', userCredential);
				// Успешно аутентифицированного пользователя сохраняем в состояние и localStorage.
				set({ user: res.data, isFetching: false, error: false });
				localStorage.setItem('user', JSON.stringify(res.data));
			} catch (err) {
				// В случае ошибки устанавливаем флаг ошибки и сохраняем сообщение об ошибке.
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Неверный пароль', // Используем сообщение от сервера, если оно есть, иначе - стандартное сообщение.
				});
			}
		},

		/**
		 * Асинхронная функция для регистрации нового пользователя.
		 * @param {Object} userData - Объект с данными для регистрации (username, email, password).
		 * Выполняет запрос на регистрацию пользователя.
		 */
		registerCall: async (userData) => {
			set({ isFetching: true, error: false }); // Устанавливаем состояние загрузки перед регистрацией.
			try {
				// Выполняем запрос на сервер для регистрации нового пользователя.
				await axios.post('/api/auth/register', userData);
				set({ isFetching: false, error: false }); // Сбрасываем флаги после успешной регистрации.

				// Автоматический вход после регистрации.
				const res = await axios.post('/api/auth/login', {
					email: userData.email,
					password: userData.password,
				});
				set({ user: res.data, isFetching: false, error: false }); // Сохраняем данные пользователя в состоянии и localStorage.
				localStorage.setItem('user', JSON.stringify(res.data));
			} catch (err) {
				// В случае ошибки сохраняем состояние ошибки.
				set({ isFetching: false, error: true });
			}
		},

		/**
		 * Очистка ошибок.
		 * Сбрасывает состояние ошибок.
		 */
		clearError: () => set({ error: false }), // Сбрасываем флаг ошибки.

		/**
		 * Действие для выхода из системы.
		 * Очищает данные пользователя из состояния и localStorage.
		 */
		logout: () => {
			localStorage.removeItem('user'); // Удаляем данные пользователя из localStorage.
			set({ user: null, isFetching: false, error: false }); // Сбрасываем состояние пользователя и флаги.
		},

		/**
		 * Добавление пользователя в список подписок (follow).
		 * @param {string} userId - ID пользователя, на которого подписываются.
		 * @returns {Object} Обновленное состояние пользователя с добавленным пользователем в список подписок.
		 */
		follow: (userId) =>
			set((state) => {
				if (!state.user) return state; // Если нет текущего пользователя, возвращаем текущее состояние.

				// Создаем новый объект пользователя с добавленным ID в список подписок.
				const updatedUser = {
					...state.user,
					followings: [...state.user.followings, userId],
				};

				// Сохраняем обновленные данные пользователя в localStorage.
				localStorage.setItem('user', JSON.stringify(updatedUser));

				// Возвращаем новое состояние с обновленным пользователем.
				return { user: updatedUser };
			}),

		/**
		 * Удаление пользователя из списка подписок (unfollow).
		 * @param {string} userId - ID пользователя, от которого отписываются.
		 * @returns {Object} Обновленное состояние пользователя с удаленным пользователем из списка подписок.
		 */
		unfollow: (userId) =>
			set((state) => {
				if (!state.user) return state; // Если нет текущего пользователя, возвращаем текущее состояние.

				// Создаем новый объект пользователя с удаленным ID из списка подписок.
				const updatedUser = {
					...state.user,
					followings: state.user.followings.filter(
						(following) => following !== userId
					),
				};

				// Сохраняем обновленные данные пользователя в localStorage.
				localStorage.setItem('user', JSON.stringify(updatedUser));

				// Возвращаем новое состояние с обновленным пользователем.
				return { user: updatedUser };
			}),
		// Новый метод для обновления списка онлайн пользователей
		setOnlineUsers: (users) => set({ onlineUsers: users }),
		
    updateUserOnlineStatus: (userId, status) =>
      set((state) => {
        if (status === 'online') {
          return { onlineUsers: [...state.onlineUsers, userId] };
        } else if (status === 'offline') {
          return {
            onlineUsers: state.onlineUsers.filter((id) => id !== userId),
          };
        }
      }),
	}))
);

export default useAuthStore;
