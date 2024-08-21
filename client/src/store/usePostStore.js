import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

/**
 * Zustand store для управления состоянием постов.
 * Включает действия для получения постов и их сохранения.
 */
const usePostStore = create(
	devtools((set, get) => ({
		posts: JSON.parse(localStorage.getItem('posts')) || [],
		isFetching: false,
		error: false,

		/**
		 * Устанавливает состояние загрузки и сбрасывает ошибки.
		 */
		fetchPostsStart: () => set({ isFetching: true, error: false }),

		/**
		 * Успешное получение постов.
		 * @param {Array} posts - Массив постов, полученных с сервера.
		 */
		fetchPostsSuccess: (posts) => {
			// Сортируем посты по дате создания (от новых к старым)
			const sortedPosts = posts.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);

			// Сохраняем отсортированные посты в localStorage и Zustand store
			localStorage.setItem('posts', JSON.stringify(sortedPosts));
			set({ posts: sortedPosts, isFetching: false, error: false });
		},

		/**
		 * Ошибка при получении постов.
		 * @param {string} errorMessage - Сообщение об ошибке.
		 */
		fetchPostsFailure: (errorMessage) =>
			set({ isFetching: false, error: errorMessage }),

		/**
		 * Асинхронная функция для получения постов.
		 * @param {string} userId - ID пользователя, для которого загружаются посты.
		 */
		fetchPosts: async (userId, username) => {
			set({ isFetching: true, error: false });
			try {
				const res = username
					? await axios.get(`/api/posts/profile/${username}`)
					: await axios.get(`/api/posts/timeline/${userId}`);

				// Сортируем полученные посты по дате и сохраняем
				const sortedPosts = res.data.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);
				set({ posts: sortedPosts, isFetching: false, error: false });
				localStorage.setItem('posts', JSON.stringify(sortedPosts));
			} catch (err) {
				set({
					isFetching: false,
					error: err.response?.data?.message || 'Ошибка загрузки постов',
				});
			}
		},

		/**
		 * Очистка состояния постов.
		 */
		clearPosts: () => {
			localStorage.removeItem('posts');
			set({ posts: [], isFetching: false, error: false });
		},

		/**
		 * Асинхронная функция для лайка поста.
		 * @param {string} postId - ID поста, который лайкаем.
		 * @param {string} userId - ID пользователя, который лайкает пост.
		 */
		likePost: async (postId, userId) => {
			try {
				await axios.put(`/api/posts/${postId}/like`, { userId });
			} catch (err) {
				console.error('Ошибка лайка поста:', err);
			}
		},

		/**
		 * Метод для переключения лайка на посте.
		 * @param {string} postId - ID поста, который лайкаем.
		 * @param {string} userId - ID пользователя, который лайкает пост.
		 */
		toggleLike: (postId, userId) => {
			set((state) => {
				const updatedPosts = state.posts.map((post) => {
					if (post._id === postId) {
						const isLiked = post.likes.includes(userId);
						const updatedLikes = isLiked
							? post.likes.filter((id) => id !== userId)
							: [...post.likes, userId];

						return { ...post, likes: updatedLikes };
					}
					return post;
				});

				// Сохраняем обновленные посты в localStorage
				localStorage.setItem('posts', JSON.stringify(updatedPosts));

				// Возвращаем новое состояние
				return { posts: updatedPosts };
			});

			// Синхронизируем с сервером
			get().likePost(postId, userId);
		},
	}))
);

export default usePostStore;
