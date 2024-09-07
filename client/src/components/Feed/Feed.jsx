import { useEffect, useState } from 'react';
import Post from '../Post/Post';
import Share from '../Share/Share';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';
import './feed.css';
import { Skeleton } from '@mui/material';

/**
 * Компонент `Feed` отображает ленту постов и компонент для создания новых постов.
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} props.username - Имя пользователя, для которого отображаются посты (если задано).
 *
 * @returns {JSX.Element} Компонент, отображающий ленту постов и, при необходимости, компонент Share.
 */

const Feed = ({ username }) => {
	// Получаем данные текущего пользователя из стора
	const user = useAuthStore((state) => state.getUser());
	// Получаем состояние постов и функцию для их загрузки из стора
	const { posts, fetchPosts } = usePostStore();
	// Состояние для отслеживания процесса загрузки данных
	const [loading, setLoading] = useState(true);

	/**
	 * useEffect для загрузки постов текущего пользователя или указанного пользователя при изменении `username` или `user`.
	 */
	useEffect(() => {
		if (user) {
			// Загружаем посты текущего пользователя или указанного пользователя
			fetchPosts(user._id, username).finally(() => setLoading(false));
		}
	}, [username, user, fetchPosts]);

	// Определяем, следует ли отображать компонент Share (если мы на странице профиля текущего пользователя или если `username` не задан)
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
