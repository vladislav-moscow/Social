import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../Post/Post';
import Share from '../Share/Share';
//import { usePostStore } from '../../store/usePostStore';
import useAuthStore from '../../store/useAuthStore';

import './feed.css';

const Feed = ({ username }) => {
	// Получаем посты из Zustand Store
	//const posts = usePostStore((state) => state.posts);
	const [posts, setPosts] = useState([]);
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.getUser());

	useEffect(() => {
		const fetchPosts = async () => {
			const res = username
				? await axios.get('/api/posts/profile/' + username)
				: await axios.get('/api/posts/timeline/' + user._id);
			setPosts(res.data);
		};
		fetchPosts();
	}, [username, user._id]);
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
