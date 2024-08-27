import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVert } from '@mui/icons-material';
import './post.css';
import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';
import useUserStore from '../../store/useUserStore';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

// Регистрируем русскую локализацию для timeago.js, чтобы отображать дату и время в русском формате.
register('ru', ru);

/**
 * Компонент `Post` отображает информацию о посте, включая текст, изображение, информацию о пользователе и функциональность лайков.
 * @param {Object} post - Объект, содержащий данные о посте.
 * @param {string} post._id - Уникальный идентификатор поста.
 * @param {string} post.userId - Уникальный идентификатор пользователя, создавшего пост.
 * @param {Array} post.likes - Массив идентификаторов пользователей, которые лайкнули пост.
 * @param {string} post.createdAt - Дата и время создания поста.
 * @param {string} post.desc - Текст поста.
 * @param {string} post.img - URL изображения поста.
 * @param {number} post.comment - Количество комментариев к посту.
 * @returns {JSX.Element} - Рендерит элемент поста.
 */
const Post = ({ post }) => {
	// Получаем данные текущего пользователя из Zustand store.
	const user = useAuthStore((state) => state.user);
	// Получаем функции для работы с постами и пользователями из Zustand store.
	const fetchPostUser = usePostStore((state) => state.fetchPostUser); // Функция для загрузки данных пользователя, создавшего пост.
	const getUserById = useUserStore((state) => state.getUserById); // Функция для получения данных пользователя по его ID.
	const toggleLike = usePostStore((state) => state.toggleLike); // Функция для обработки лайков.
	const deletePost = usePostStore((state) => state.deletePost); // Функция удаление поста
	// Получаем путь к публичной папке из окружения для формирования полного пути к изображениям.
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	const [menuVisible, setMenuVisible] = useState(false); // состояние для меню
	const [isModalOpen, setIsModalOpen] = useState(false);
	const menuRef = useRef();

	/**
	 * Инициализируем состояние для лайков.
	 * @param {number} likeState - количество лайков на посте.
	 * @param {boolean} isLiked - флаг, указывающий, лайкнул ли текущий пользователь этот пост.
	 */
	const [likeState, setLikeState] = useState({
		likeCount: post.likes.length,
		isLiked: post.likes.includes(user._id),
	});

	// Форматируем дату создания поста с использованием timeago.js и русской локализации.
	const formattedDate = format(post.createdAt, 'ru');

	// Используем useEffect для загрузки данных пользователя, создавшего пост, при монтировании компонента.
	useEffect(() => {
		fetchPostUser(post.userId);
	}, [post.userId, fetchPostUser]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setMenuVisible(false);
			}
		};

		const disableScroll = () => {
			if (isModalOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		disableScroll();

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = '';
		};
	}, [menuVisible, isModalOpen]);

	// Получаем данные пользователя, создавшего пост, из Zustand store.
	const postUser = getUserById(post.userId);

	// Если данные пользователя еще не загружены, возвращаем null (не отображаем компонент).
	if (!postUser) return null;

	/**
	 * Обработчик клика по иконке лайка.
	 * Изменяет состояние лайков и отправляет запрос на сервер для обновления данных.
	 */
	const likeHandler = () => {
		toggleLike(post._id, user._id);
		// Обновляем локальное состояние лайков.
		setLikeState((prevState) => ({
			likeCount: prevState.isLiked
				? // Если пост уже был лайкнут, уменьшаем количество лайков.
				  prevState.likeCount - 1
				: // Если пост не был лайкнут, увеличиваем количество лайков.
				  prevState.likeCount + 1,
			// Инвертируем флаг isLiked.
			isLiked: !prevState.isLiked,
		}));
	};

	const handleMenuToggle = () => {
		setMenuVisible((prev) => !prev);
	};

	const handleDelete = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const confirmDelete = () => {
		deletePost(post._id, user._id);
		closeModal();
	};

	return (
		<div className='post'>
			<div className='postWrapper'>
				<div className='postTop'>
					<div className='postTopLeft'>
						<Link to={`/profile/${postUser.username}`}>
							<img
								className='postProfileImg'
								src={
									postUser.profilePicture
										? PF + postUser.profilePicture // Если у пользователя есть аватарка, отображаем её.
										: PF + 'person/noAvatar.png' // Если аватарки нет, отображаем стандартное изображение.
								}
								alt={postUser.username} // Альтернативный текст для изображения.
							/>
						</Link>
						<span className='postUsername'>{postUser.username}</span>{' '}
						{/* Отображаем имя пользователя. */}
						<span className='postDate'>{formattedDate}</span>{' '}
						{/* Отображаем дату создания поста в формате "time ago". */}
					</div>
					<div className='postTopRight' ref={menuRef}>
						<MoreVert onClick={handleMenuToggle} />
						{menuVisible && post.userId === user._id && (
							<div className='postOptionsMenu'>
								<button onClick={handleDelete}>Удалить</button>
								<button>Редактировать</button>
							</div>
						)}
					</div>
				</div>
				<div className='postCenter'>
					<span className='postText'>{post?.desc}</span>{' '}
					{/* Отображаем текст поста, если он есть. */}
					<img className='postImg' src={PF + post?.img} alt='ImgPost' />{' '}
					{/* Отображаем изображение поста, если оно есть. */}
				</div>
				<div className='postBottom'>
					<div className='postBottomLeft'>
						<img
							className='likeIcon'
							src={`${PF}heart.png`} // Иконка лайка.
							onClick={likeHandler} // Добавляем обработчик клика по иконке.
							alt='' // Альтернативный текст для изображения.
						/>
						<span className='postLikeCounter'>
							{likeState.likeCount} нравится{' '}
							{/* Отображаем количество лайков. */}
						</span>
					</div>
					<div className='postBottomRight'>
						<span className='postCommentText'>{post.comment} комментария</span>{' '}
						{/* Отображаем количество комментариев. */}
					</div>
				</div>
			</div>
			{isModalOpen && (
				<ConfirmationModal
					message='Вы уверены, что хотите удалить этот пост?'
					onConfirm={confirmDelete}
					onClose={closeModal}
				/>
			)}
		</div>
	);
};

export default Post;
