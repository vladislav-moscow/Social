import useAuthStore from '../../store/useAuthStore';
import useUserStore from '../../store/useUserStore';
import { useEffect } from 'react';

import SidebarList from '../SidebarList/SidebarList';
import Friend from '../Friend/Friend';

import './sidebar.css';

/**
 * Компонент для отображения боковой панели с навигацией и списком друзей.
 * @returns {JSX.Element} Компонент боковой панели.
 */
const Sidebar = () => {
	// Получаем текущего пользователя из Store.
	const user = useAuthStore((state) => state.user);
	// Функция для загрузки данных пользователя по ID.
	const fetchUser = useUserStore((state) => state.fetchUser);
	// Функция для получения данных пользователя по его ID.
	const getUserById = useUserStore((state) => state.getUserById);
	// Флаг загрузки данных.
	const isFetching = useUserStore((state) => state.isFetching);
	// Сообщение об ошибке, если таковая имеется.
	const error = useUserStore((state) => state.error);

	/**
	 * Эффект для загрузки данных друзей пользователя при изменении `user` или его `followings`.
	 * Запрашивает данные для каждого друга, если они еще не загружены.
	 */
	useEffect(() => {
		if (user && user.followings) {
			// Для каждого ID друга проверяем, загружены ли данные в состояние.
			user.followings.forEach((friendId) => {
				if (!getUserById(friendId)) {
					fetchUser(friendId); // Загружаем данные пользователя по ID.
				}
			});
		}
	}, [user, fetchUser, getUserById]);

	// Отображаем индикатор загрузки, если данные еще загружаются.
	if (isFetching) return <p>Загрузка...</p>;
	// Отображаем сообщение об ошибке, если произошла ошибка при загрузке данных.
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div className='sidebar'>
			<div className='sidebarWrapper'>
				<SidebarList/>
				<h2 className='sidebarMyFriend'>Мои друзья:</h2>
				<ul className='sidebarFriendList'>
					{/* Проверяем, есть ли друзья у пользователя */}
					{user.followings && user.followings.length > 0 ? (
						user.followings.map((friendId) => (
							<Friend key={friendId} friendId={friendId} />
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
