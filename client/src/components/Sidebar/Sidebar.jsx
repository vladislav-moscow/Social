import useAuthStore from '../../store/useAuthStore';
import useUserStore from '../../store/useUserStore';
import { useEffect, useState } from 'react';
import SidebarList from '../SidebarList/SidebarList';
import Friend from '../Friend/Friend';
import { Skeleton } from '@mui/material';

import './sidebar.css';

/**
 * Компонент `Sidebar` отображает боковую панель с навигационным списком и списком друзей пользователя.
 * @returns {JSX.Element} - Рендерит боковую панель с данными и списком друзей.
 */
const Sidebar = () => {
	// Получаем текущего пользователя из Zustand store.
	const user = useAuthStore((state) => state.user);
	// Функция для загрузки данных пользователя по ID.
	const fetchUser = useUserStore((state) => state.fetchUser);
	// Функция для получения данных пользователя по его ID.
	const getUserById = useUserStore((state) => state.getUserById);
	// Флаг загрузки данных.
	const isFetching = useUserStore((state) => state.isFetching);
	// Локальный стейт для хранения данных друзей
	const [friends, setFriends] = useState([]);

	/**
	 * Эффект для загрузки данных друзей пользователя при изменении `user` или его `followings`.
	 * Запрашивает данные для каждого друга, если они еще не загружены.
	 */
	useEffect(() => {
		if (user && user.followings) {
			// Массив для хранения загруженных друзей
			const friendsData = [];

			// Для каждого ID друга проверяем, загружены ли данные в состояние.
			user.followings.forEach((friendId) => {
				const friend = getUserById(friendId);
				if (!friend) {
					// Загружаем данные пользователя по ID.
					fetchUser(friendId).then(() => {
						const newFriend = getUserById(friendId);
						friendsData.push(newFriend); // Добавляем друга в массив
						setFriends([...friendsData]); // Обновляем локальный стейт
					});
				} else {
					friendsData.push(friend); // Если друг уже есть, добавляем его в массив
					setFriends([...friendsData]); // Обновляем локальный стейт
				}
			});
		}
	}, [user, fetchUser, getUserById]);

	// Отображаем скелетон, если данные еще загружаются.
	if (isFetching)
		return (
			<div className='sidebar'>
				<div className='sidebarWrapper'>
					<SidebarList isLoading={isFetching} />{' '}
					{/* Передаем флаг загрузки в компонент SidebarList */}
					<h2 className='sidebarMyFriend'>Мои друзья:</h2>
					<div className='sidebarFriendList'>
						{/* Отображаем скелетоны для индикатора загрузки списка друзей */}
						{[...Array(5)].map((_, index) => (
							<Skeleton
								key={index}
								variant='rectangular'
								width='25%'
								height={30}
								sx={{ mb: 1 }}
							/>
						))}
					</div>
				</div>
			</div>
		);

	return (
		<div className='sidebar'>
			<div className='sidebarWrapper'>
				<SidebarList />
				<h2 className='sidebarMyFriend'>Мои друзья:</h2>
				<ul className='sidebarFriendList'>
					{/* Проверяем, есть ли друзья у пользователя */}
					{friends.length > 0 ? (
						friends.map((friend) => (
							<Friend key={friend._id} friend={friend} />
						))
					) : (
						<p>У вас пока нет друзей.</p>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
