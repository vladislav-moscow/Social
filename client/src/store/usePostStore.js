import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import useUserStore from './useUserStore'; // Импортируем новый стор

/**
 * Zustand store для управления состоянием постов.
 * Включает действия для получения постов, их сортировки, сохранения, лайков и очистки состояния.
 */
const usePostStore = create(
	devtools((set, get) => ({
		// Начальное состояние стора
		posts: JSON.parse(localStorage.getItem('posts')) || [], // Список постов, изначально загруженный из localStorage (если есть).
		isFetching: false, // Флаг загрузки данных, чтобы отслеживать состояние загрузки.
		error: false, // Флаг ошибки, чтобы отслеживать состояние ошибок.

		/**
		 * Устанавливает состояние загрузки и сбрасывает ошибки.
		 * Используется перед началом асинхронных операций, таких как загрузка постов.
		 */
		fetchPostsStart: () => set({ isFetching: true, error: false }),

		/**
		 * Успешное получение постов.
		 * @param {Array} posts - Массив постов, полученных с сервера.
		 * Сортирует посты по дате создания, сохраняет их в localStorage и обновляет состояние стора.
		 */
		fetchPostsSuccess: (posts) => {
			// Сортируем посты по дате создания (от новых к старым)
			const sortedPosts = posts.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);

			// Сохраняем отсортированные посты в localStorage и Zustand store
			localStorage.setItem('posts', JSON.stringify(sortedPosts)); // Сохранение постов в localStorage для возможности восстановления состояния при перезагрузке.
			set({ posts: sortedPosts, isFetching: false, error: false }); // Обновление состояния стора.
		},

		/**
		 * Обработка ошибки при получении постов.
		 * @param {string} errorMessage - Сообщение об ошибке.
		 * Сбрасывает состояние загрузки и сохраняет сообщение об ошибке.
		 */
		fetchPostsFailure: (errorMessage) =>
			set({ isFetching: false, error: errorMessage }),

		/**
		 * Асинхронная функция для получения постов.
		 * @param {string} userId - ID пользователя, для которого загружаются посты.
		 * @param {string} username - Имя пользователя (опционально), для которого загружаются посты.
		 */
		fetchPosts: async (userId, username) => {
			set({ isFetching: true, error: false }); // Устанавливаем состояние загрузки перед запросом.
			try {
				// В зависимости от наличия username выполняем соответствующий запрос к API.
				const res = username
					? await axios.get(`/api/posts/profile/${username}`) // Получение постов по имени пользователя.
					: await axios.get(`/api/posts/timeline/${userId}`); // Получение постов по ID пользователя (таймлайн).

				// Сортируем полученные посты по дате и сохраняем
				const sortedPosts = res.data.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);
				set({ posts: sortedPosts, isFetching: false, error: false }); // Обновляем состояние с полученными постами.
				localStorage.setItem('posts', JSON.stringify(sortedPosts)); // Сохраняем посты в localStorage.
			} catch (err) {
				// В случае ошибки, сохраняем сообщение об ошибке.
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Ошибка загрузки постов', // Обработка ошибок от сервера или использование стандартного сообщения.
				});
			}
		},

		/**
		 * Очистка состояния постов.
		 * Удаляет посты из localStorage и сбрасывает состояние стора.
		 */
		clearPosts: () => {
			localStorage.removeItem('posts'); // Удаление постов из localStorage.
			set({ posts: [], isFetching: false, error: false }); // Сброс состояния постов.
		},

		/**
		 * Асинхронная функция для получения данных пользователя, создавшего пост.
		 * @param {string} userId - ID пользователя, создавшего пост.
		 */
		fetchPostUser: (userId) => {
			const fetchUser = useUserStore.getState().fetchUser; // Получаем функцию fetchUser из useUserStore для получения данных пользователя.
			fetchUser(userId); // Выполняем вызов функции для загрузки данных пользователя по его ID.
		},

		/**
		 * Асинхронная функция для лайка поста.
		 * @param {string} postId - ID поста, который лайкаем.
		 * @param {string} userId - ID пользователя, который лайкает пост.
		 * Выполняет PUT-запрос к серверу для обновления информации о лайках.
		 */
		likePost: async (postId, userId) => {
			try {
				await axios.put(`/api/posts/${postId}/like`, { userId }); // Выполнение запроса для обновления лайков на сервере.
			} catch (err) {
				console.error('Ошибка лайка поста:', err); // Вывод ошибки в консоль в случае неудачи.
			}
		},

		/**
		 * Метод для переключения лайка на посте.
		 * @param {string} postId - ID поста, который лайкаем.
		 * @param {string} userId - ID пользователя, который лайкает пост.
		 * Обновляет состояние лайков на клиенте и синхронизирует его с сервером.
		 */
		toggleLike: (postId, userId) => {
			set((state) => {
				// Обновляем локально состояние лайков в постах
				const updatedPosts = state.posts.map((post) => {
					if (post._id === postId) {
						// Проверяем, лайкал ли пользователь этот пост ранее
						const isLiked = post.likes.includes(userId);
						const updatedLikes = isLiked
							? post.likes.filter((id) => id !== userId) // Удаляем лайк, если он уже есть
							: [...post.likes, userId]; // Добавляем лайк, если его не было

						return { ...post, likes: updatedLikes }; // Возвращаем обновленный пост с обновленным списком лайков.
					}
					return post; // Возвращаем пост без изменений, если ID не совпадает.
				});

				// Сохраняем обновленные посты в localStorage для сохранения состояния после перезагрузки страницы.
				localStorage.setItem('posts', JSON.stringify(updatedPosts));

				// Возвращаем новое состояние, обновляя posts в Zustand store.
				return { posts: updatedPosts };
			});

			// Синхронизируем изменения с сервером, вызвав likePost.
			get().likePost(postId, userId);
		},
	}))
);

export default usePostStore;
