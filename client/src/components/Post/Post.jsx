import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { MoreVert } from '@mui/icons-material';
import './post.css';

const Post = ({ post }) => {
	// Стейт для хранения информации о лайках
	const [likeState, setLikeState] = useState({
		likeCount: post.like,
		isLiked: false,
	});
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

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
	const getUserById = useUserStore((state) => state.getUserById);

	// Ищем пользователя по id с использованием Zustand
	const user = getUserById(post?.userId);

	return (
		<div className='post'>
			<div className='postWrapper'>
				<div className='postTop'>
					<div className='postTopLeft'>
						<img
							className='postProfileImg'
							src={PF+user?.profilePicture || 'default-avatar.png'}
							alt={user ? `${user.username}'s avatar` : 'default avatar'}
						/>
						<span className='postUsername'>
							{user?.username || 'Unknown User'}
						</span>
						<span className='postDate'>{post.date}</span>
					</div>
					<div className='postTopRight'>
						<MoreVert />
					</div>
				</div>
				<div className='postCenter'>
					<span className='postText'>{post?.desc}</span>
					<img className='postImg' src={PF+post?.photo} alt='ImgPost' />
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
