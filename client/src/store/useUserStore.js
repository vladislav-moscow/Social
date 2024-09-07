import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

/**
 * Zustand store для управления состоянием пользователей.
 * Хранит данные пользователей, флаги состояния загрузки и ошибок, и предоставляет функции для асинхронного получения данных о пользователях и их друзей.
 *
 * @typedef {Object} User
 * @property {string} _id - Идентификатор пользователя.
 * @property {string} username - Имя пользователя.
 * @property {string} email - Электронная почта пользователя.
 * @property {string} [profilePicture] - Ссылка на профильное изображение пользователя (опционально).
 * @property {string[]} friends - Массив идентификаторов друзей пользователя.
 * @property {string[]} followers - Массив идентификаторов подписчиков пользователя.
 *
 * @typedef {Object} UserStore
 * @property {Object.<string, User>} users - Объект, где ключом является идентификатор пользователя, а значением - данные пользователя.
 * @property {boolean} isFetching - Флаг, указывающий на выполнение запроса (загрузка данных).
 * @property {boolean|string} error - Переменная для хранения сообщения об ошибке, если она возникла.
 * @property {Function} fetchUser - Асинхронная функция для получения данных пользователя по ID.
 * @property {Function} fetchFriends - Асинхронная функция для получения списка друзей пользователя по ID.
 * @property {Function} fetchUserByUsername - Асинхронная функция для получения данных пользователя по имени.
 * @property {Function} fetchFollowers - Асинхронная функция для получения списка подписчиков пользователя по ID.
 * @property {Function} getUserById - Метод для получения данных пользователя по его ID.
 * @property {Function} getUserByUsername - Метод для получения данных пользователя по его имени.
 * @property {Function} clearUsers - Метод для очистки всех данных пользователей.
 */
const useUserStore = create(
	devtools((set, get) => ({
		// Начальное состояние стора
		users: {}, // Загружаем пользователей из localStorage при инициализации
		isFetching: false, // Флаг загрузки данных, чтобы отслеживать состояние загрузки.
		error: false, // Флаг ошибки, чтобы отслеживать состояние ошибок.

		/**
		 * Асинхронная функция для получения данных пользователя.
		 * Проверяет, загружен ли пользователь уже в состояние; если да, ничего не делает.
		 * Если нет, выполняет запрос к серверу для получения данных пользователя и сохраняет их в состоянии.
		 *
		 * @param {string} userId - ID пользователя.
		 */
		fetchUser: async (userId) => {
			const existingUser = get().users[userId]; // Проверяем, есть ли уже данные о пользователе в состоянии.

			// Если пользователь уже загружен, ничего не делаем
			if (existingUser) return;
			// Устанавливаем состояние загрузки перед выполнением запроса.
			set({ isFetching: true, error: false });

			try {
				// Выполняем запрос к серверу для получения данных пользователя по его ID.
				const res = await axios.get(`/api/users?userId=${userId}`);
				// Обновляем состояние после успешной загрузки
				set((state) => {
					const updatedUsers = { ...state.users, [userId]: res.data };
					return {
						users: updatedUsers,
						isFetching: false,
						error: false,
					};
				});
			} catch (err) {
				// В случае ошибки, сохраняем сообщение об ошибке в состояние.
				set({
					isFetching: false, // Сбрасываем флаг загрузки.
					error: err.response?.data?.message || 'Ошибка загрузки пользователя', // Обработка ошибок от сервера или использование стандартного сообщения.
				});
			}
		},

		/**
		 * Асинхронная функция для получения списка друзей пользователя по ID.
		 * Устанавливает состояние загрузки перед выполнением запроса.
		 *
		 * @param {string} userId - ID пользователя, для которого нужно получить список друзей.
		 */
		fetchFriends: async (userId) => {
			set({ isFetching: true, error: false });

			try {
				const res = await axios.get(`/api/users/friends/${userId}`);

				set((state) => {
					const updatedUsers = { ...state.users };
					res.data.forEach((friend) => {
						updatedUsers[friend._id] = friend;
					});
					return {
						users: updatedUsers,
						isFetching: false,
						error: false,
					};
				});
			} catch (err) {
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Ошибка загрузки списка друзей',
				});
			}
		},

		/**
		 * Асинхронная функция для получения данных пользователя по имени.
		 * Проверяет, загружен ли пользователь уже в состояние; если да, ничего не делает.
		 * Если нет, выполняет запрос к серверу для получения данных пользователя и сохраняет их в состоянии.
		 *
		 * @param {string} username - Имя пользователя, данные которого нужно получить.
		 */
		fetchUserByUsername: async (username) => {
			const existingUser = get().users[username];

			// Если данные пользователя уже существуют в состоянии, прекращаем выполнение функции.
			if (existingUser) return;

			// Устанавливаем состояние загрузки и сбрасываем флаг ошибки.
			set({ isFetching: true, error: false });

			try {
				// Выполняем асинхронный запрос к API для получения данных пользователя по имени.
				const res = await axios.get(`/api/users?username=${username}`);

				// Обновляем состояние новыми данными пользователя.
				set((state) => {
					const updatedUsers = { ...state.users, [username]: res.data };
					return {
						users: updatedUsers,
						isFetching: false,
						error: false,
					};
				});
			} catch (err) {
				// Если произошла ошибка при запросе, обновляем состояние с сообщением об ошибке.
				set({
					isFetching: false, // Устанавливаем флаг завершения загрузки.
					error: err.response?.data?.message || 'Ошибка загрузки пользователя', // Обработка сообщения об ошибке, если оно доступно.
				});
			}
		},

		/**
		 * Асинхронная функция для получения списка подписчиков пользователя по ID.
		 * Устанавливает состояние загрузки перед выполнением запроса.
		 *
		 * @param {string} userId - ID пользователя, для которого нужно получить список подписчиков.
		 */
		fetchFollowers: async (userId) => {
			set({ isFetching: true, error: false });

			try {
				const res = await axios.get(`/api/users/followers/${userId}`);

				set((state) => {
					const updatedUsers = { ...state.users };
					res.data.forEach((follower) => {
						updatedUsers[follower._id] = follower;
					});
					return {
						users: updatedUsers,
						isFetching: false,
						error: false,
					};
				});
			} catch (err) {
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Ошибка загрузки подписчиков',
				});
			}
		},

		/**
		 * Метод для получения пользователя из состояния по его ID.
		 *
		 * @param {string} userId - ID пользователя.
		 * @returns {User|null} - Данные пользователя или null, если пользователь не найден в состоянии.
		 */
		getUserById: (userId) => get().users[userId],

		/**
		 * Метод для получения пользователя из состояния по его имени.
		 *
		 * @param {string} username - Имя пользователя.
		 * @returns {User|null} - Данные пользователя или null, если пользователь не найден в состоянии.
		 */
		getUserByUsername: (username) => get().users[username],

		/**
		 * Очистка всех данных пользователей.
		 * Удаляет всех пользователей из состояния, сбрасывая состояние `users`.
		 */
		clearUsers: () => {
			set({ users: {} });
		},
	}))
);

export default useUserStore;
