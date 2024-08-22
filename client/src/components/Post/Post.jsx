import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVert } from '@mui/icons-material';
import './post.css';
import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';
import useUserStore from '../../store/useUserStore';

// Регистрируем русскую локализацию для timeago.js.
register('ru', ru);

const Post = ({ post }) => {
	// Получаем данные текущего пользователя из стора.
	const user = useAuthStore((state) => state.user);

	// Получаем функции из стора постов и пользователей для работы с данными.
	const fetchPostUser = usePostStore((state) => state.fetchPostUser); // Функция для загрузки данных пользователя, создавшего пост.
  const getUserById = useUserStore((state) => state.getUserById); // Функция для получения данных пользователя по его ID.
	const toggleLike = usePostStore((state) => state.toggleLike); // Функция для обработки лайков.

	// Получаем путь к публичной папке из окружения.
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	// Инициализируем состояние для лайков, включающее количество лайков и флаг, лайкнул ли текущий пользователь этот пост.
	const [likeState, setLikeState] = useState({
		likeCount: post.likes.length, // Количество лайков.
		isLiked: post.likes.includes(user._id), // Флаг, указывающий, лайкнул ли текущий пользователь этот пост.
	});

	// Форматируем дату создания поста с использованием timeago.js и русской локализации.
	const formattedDate = format(post.createdAt, 'ru');

	// Используем useEffect для загрузки данных пользователя, который создал пост, при монтировании компонента.
	useEffect(() => {
		fetchPostUser(post.userId);
	}, [post.userId, fetchPostUser]); // Зависимости включают userId поста и функцию fetchPostUser.

	// Получаем данные пользователя, создавшего пост, из стора пользователей.
	const postUser = getUserById(post.userId);

	// Если данные пользователя еще не загружены, ничего не рендерим.
	if (!postUser) return null;

	// Обработчик клика по иконке лайка.
	const likeHandler = () => {
		toggleLike(post._id, user._id); // Вызываем функцию toggleLike из стора для изменения состояния лайка на сервере.

		// Обновляем локальное состояние лайков.
		setLikeState((prevState) => ({
			likeCount: prevState.isLiked
				? prevState.likeCount - 1 // Если пост уже был лайкнут, уменьшаем количество лайков.
				: prevState.likeCount + 1, // Если пост не был лайкнут, увеличиваем количество лайков.
			isLiked: !prevState.isLiked, // Инвертируем флаг isLiked.
		}));
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

						<span className='postUsername'>{postUser.username}</span> {/* Отображаем имя пользователя. */}
						<span className='postDate'>{formattedDate}</span> {/* Отображаем дату создания поста в формате "time ago". */}
					</div>
					<div className='postTopRight'>
						<MoreVert /> {/* Иконка меню с дополнительными опциями для поста. */}
					</div>
				</div>
				<div className='postCenter'>
					<span className='postText'>{post?.desc}</span> {/* Отображаем текст поста, если он есть. */}
					<img className='postImg' src={PF + post?.img} alt='ImgPost' /> {/* Отображаем изображение поста, если оно есть. */}
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
							{likeState.likeCount} нравится {/* Отображаем количество лайков. */}
						</span>
					</div>
					<div className='postBottomRight'>
						<span className='postCommentText'>{post.comment} комментария</span> {/* Отображаем количество комментариев. */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
