import Post from '../Post/Post';
import Share from '../Share/Share';
import { usePostStore } from '../../store/usePostStore';

import './feed.css';

const Feed = () => {
	// Получаем посты из Zustand Store
	const posts = usePostStore((state) => state.posts);

	return (
		<div className='feed'>
			<div className='feedWrapper'>
				<Share />
				{posts.map((post) => (
					<Post key={post.id} post={post} />
				))}
			</div>
		</div>
	);
};

export default Feed;
