import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//import { useUserStore } from '../../store/useUserStore';
import { MoreVert } from '@mui/icons-material';
import './post.css';
import axios from 'axios';
import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';

// Регистрируем русскую локализацию
register('ru', ru);

const Post = ({ post }) => {
	// Форматируем дату с помощью timeago.js
  const formattedDate = format(post.createdAt, 'ru');
	const [likeState, setLikeState] = useState({
		likeCount: post.likes.length,
		isLiked: false,
	});

	const [user, setUser] = useState({});

	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axios.get(`/api/users?userId=${post.userId}`);
			setUser(res.data);
		};
		fetchUser();
	}, [post.userId]);

	/// Функция добавления и удаления лайка с поста
	const likeHandler = () => {
		setLikeState((prevState) => ({
			likeCount: prevState.isLiked
				? prevState.likeCount - 1
				: prevState.likeCount + 1,
			isLiked: !prevState.isLiked,
		}));
	};

	// Получаем функцию getUserById из Zustand
	//const getUserById = useUserStore((state) => state.getUserById);

	// Ищем пользователя по id с использованием Zustand
	//const user = getUserById(post?.userId);

	return (
		<div className='post'>
			<div className='postWrapper'>
				<div className='postTop'>
					<div className='postTopLeft'>
						<Link to={`/profile/${user.username}`}>
						<img
							className='postProfileImg'
							src={PF + user?.profilePicture || 'default-avatar.png'}
							alt={user ? `${user.username}'s avatar` : 'default avatar'}
						/>
						</Link>
						
						<span className='postUsername'>
							{user?.username || 'Unknown User'}
						</span>
						<span className='postDate'>{formattedDate}</span>
					</div>
					<div className='postTopRight'>
						<MoreVert />
					</div>
				</div>
				<div className='postCenter'>
					<span className='postText'>{post?.desc}</span>
					<img className='postImg' src={PF + post?.img} alt='ImgPost' />
				</div>
				<div className='postBottom'>
					<div className='postBottomLeft'>
						<img
							className='likeIcon'
							src={`${PF}heart.png`}
							onClick={likeHandler}
							alt=''
						/>
						<span className='postLikeCounter'>
							{likeState.likeCount} нравится
						</span>
					</div>
					<div className='postBottomRight'>
						<span className='postCommentText'>{post.comment} комментария</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
