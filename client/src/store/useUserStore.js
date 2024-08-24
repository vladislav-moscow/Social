import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

/**
 * Zustand store для управления состоянием пользователей.
 * Включает действия для получения данных пользователей и их сохранения.
 */
const useUserStore = create(
	devtools((set, get) => ({
		// Начальное состояние стора
		users: {}, // Хранение данных пользователей, организованных по их ID.
		isFetching: false, // Флаг загрузки данных, чтобы отслеживать состояние загрузки.
		error: false, // Флаг ошибки, чтобы отслеживать состояние ошибок.

		/**
		 * Асинхронная функция для получения данных пользователя.
		 * @param {string} userId - ID пользователя.
		 * Проверяет, загружен ли пользователь уже в состояние; если да, ничего не делает.
		 * Если нет, выполняет запрос к серверу для получения данных пользователя и сохраняет их в состоянии.
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
				// Обновляем состояние, добавляя полученные данные пользователя.
				set((state) => ({
					users: { ...state.users, [userId]: res.data }, // Добавляем данные нового пользователя в объект users.
					isFetching: false, // Сбрасываем флаг загрузки после успешного получения данных.
					error: false, // Сбрасываем состояние ошибки.
				}));
			} catch (err) {
				// В случае ошибки, сохраняем сообщение об ошибке в состояние.
				set({
					isFetching: false, // Сбрасываем флаг загрузки.
					error: err.response?.data?.message || 'Ошибка загрузки пользователя', // Обработка ошибок от сервера или использование стандартного сообщения.
				});
			}
		},
		/*fetchUserById: async (userId) => {
			const existingUser = get().users[userId];
			if (existingUser) return;

			set({ isFetching: true, error: false });

			try {
				const res = await axios.get(`/api/users?userId=${userId}`);
				set((state) => ({
					users: { ...state.users, [userId]: res.data },
					isFetching: false,
					error: false,
				}));
			} catch (err) {
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Ошибка загрузки пользователя',
				});
			}
		},*/

		// Новый метод для получения списка друзей по ID пользователя
		fetchFriends: async (userId) => {
			set({ isFetching: true, error: false }); // Устанавливаем флаг загрузки.

			try {
				// Запрашиваем список друзей с сервера.
				const res = await axios.get(`/api/users/friends/${userId}`);

				set((state) => {
					const updatedUsers = { ...state.users };

					// Сохраняем каждого друга в состоянии, добавляя его данные в объект users.
					res.data.forEach((friend) => {
						updatedUsers[friend._id] = friend;
					});

					return {
						users: updatedUsers, // Обновляем состояние с данными всех друзей.
						isFetching: false, // Сбрасываем флаг загрузки.
						error: false, // Сбрасываем ошибку.
					};
				});
			} catch (err) {
				// В случае ошибки, устанавливаем флаг ошибки и сохраняем сообщение об ошибке.
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Ошибка загрузки списка друзей',
				});
			}
		},

		/**
		 * Асинхронная функция для получения данных пользователя по имени.
		 * @param {string} username - Имя пользователя, данные которого нужно получить.
		 */
		fetchUserByUsername: async (username) => {
			// Получаем текущие данные из состояния стора.
			const existingUser = get().users[username];

			// Если данные пользователя уже существуют в состоянии, прекращаем выполнение функции.
			if (existingUser) return;

			// Устанавливаем состояние загрузки и сбрасываем флаг ошибки.
			set({ isFetching: true, error: false });

			try {
				// Выполняем асинхронный запрос к API для получения данных пользователя по имени.
				const res = await axios.get(`/api/users?username=${username}`);

				// Обновляем состояние стора новыми данными пользователя.
				// Используем spread оператор для копирования существующих данных и добавляем новые данные для указанного имени пользователя.
				set((state) => ({
					users: { ...state.users, [username]: res.data },
					isFetching: false, // Устанавливаем флаг завершения загрузки.
					error: false, // Сбрасываем флаг ошибки.
				}));
			} catch (err) {
				// Если произошла ошибка при запросе, обновляем состояние с сообщением об ошибке.
				set({
					isFetching: false, // Устанавливаем флаг завершения загрузки.
					error: err.response?.data?.message || 'Ошибка загрузки пользователя', // Обработка сообщения об ошибке, если оно доступно.
				});
			}
		},

		/**
		 * Метод для получения пользователя из состояния по его ID.
		 * @param {string} userId - ID пользователя.
		 * @returns {Object|null} - Данные пользователя или null, если пользователь не найден в состоянии.
		 */
		getUserById: (userId) => get().users[userId], // Возвращаем данные пользователя, если они уже есть в состоянии.
		getUserByUsername: (username) => get().users[username], // Возвращаем данные пользователя, если они уже есть в состоянии.

		/**
		 * Универсальный метод для получения пользователя по ID или имени.
		 * @param {string} identifier - ID или имя пользователя.
		 * @returns {Object|null} - Данные пользователя или null, если пользователь не найден.
		 */
		/*getUser: async (identifier) => {
			let user = get().users[identifier];

			if (!user) {
				if (identifier.includes('@')) {
					// Предполагаем, что это имя пользователя
					await get().fetchUserByUsername(identifier);
				} else {
					// Предполагаем, что это ID
					await get().fetchUserById(identifier);
				}
				user = get().users[identifier];
			}

			return user || null; // Возвращаем пользователя, если найден, иначе null.
		},*/

		/**
		 * Очистка всех данных пользователей.
		 * Удаляет всех пользователей из состояния, сбрасывая состояние users.
		 */
		clearUsers: () => set({ users: {} }), // Очистка всех данных пользователей.
	}))
);

export default useUserStore;
