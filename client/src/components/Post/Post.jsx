import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVert } from '@mui/icons-material';
import './post.css';
import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';

// Регистрируем русскую локализацию
register('ru', ru);

const Post = ({ post }) => {
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.user);
	const fetchPostUser = usePostStore((state) => state.fetchPostUser);
	const postUsers = usePostStore((state) => state.postUsers);
	const toggleLike = usePostStore((state) => state.toggleLike);
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	const [likeState, setLikeState] = useState({
		likeCount: post.likes.length,
		isLiked: post.likes.includes(user._id),
	});
	// Форматируем дату с помощью timeago.js
	const formattedDate = format(post.createdAt, 'ru');

	useEffect(() => {
		fetchPostUser(post.userId);
	}, [post.userId, fetchPostUser]);

	const postUser = postUsers[post.userId];

	if (!postUser) return null;

	const likeHandler = () => {
		toggleLike(post._id, user._id);

		setLikeState((prevState) => ({
			likeCount: prevState.isLiked
				? prevState.likeCount - 1
				: prevState.likeCount + 1,
			isLiked: !prevState.isLiked,
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
										? PF + postUser.profilePicture
										: PF + 'person/noAvatar.png'
								}
								alt={postUser.username}
							/>
						</Link>

						<span className='postUsername'>{postUser.username}</span>
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
