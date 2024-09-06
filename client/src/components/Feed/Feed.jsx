import { useEffect, useState } from 'react';
import Post from '../Post/Post';
import Share from '../Share/Share';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';
import './feed.css';
import { Skeleton } from '@mui/material';

const Feed = ({ username }) => {
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.getUser());
	const { posts, fetchPosts } = usePostStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user) {
				fetchPosts(user._id, username).finally(() => setLoading(false));
		}
}, [username, user, fetchPosts]);

	// Отображаем компонент Share, если мы на странице профиля текущего пользователя или всегда
	const showShareComponent = username === user.username || !username;

	return (
		<div className='feed'>
			<div className='feedWrapper'>
				{loading ? (
					<div className='shareSkeleton'>
						<Skeleton variant='rectangular' width='100%' height={120} />
						<Skeleton variant='text' width='60%' height={40} />
					</div>
				) : (
					showShareComponent && <Share />
				)}
				{loading ? (
					<div className='postSkeleton'>
						{[...Array(3)].map((_, index) => (
							<div key={index} className='postSkeletonItem'>
								<Skeleton variant='rectangular' width='100%' height={200} />
								<Skeleton variant='text' width='40%' height={30} />
								<Skeleton variant='text' width='20%' height={20} />
							</div>
						))}
					</div>
				) : (
					posts.map((post) => <Post key={post._id} post={post} />)
				)}
			</div>
		</div>
	);
};

export default Feed;
