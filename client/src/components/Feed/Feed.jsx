import { useEffect } from 'react';
import Post from '../Post/Post';
import Share from '../Share/Share';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';
import './feed.css';

const Feed = ({ username }) => {
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.getUser());
	const { posts, fetchPosts } = usePostStore();

	useEffect(() => {
		if (user) {
			// Загружаем посты при изменении пользователя или имени пользователя
			fetchPosts(user._id, username);
		}
	}, [username, user, fetchPosts]);

	return (
		<div className='feed'>
			<div className='feedWrapper'>
				<Share />
				{posts.map((post) => (
					<Post key={post._id} post={post} />
				))}
			</div>
		</div>
	);
};

export default Feed;
