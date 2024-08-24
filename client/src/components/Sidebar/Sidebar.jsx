import {
	Chat,
	Group,
	PlayCircleFilledOutlined,
	RssFeed,
	School,
	WorkOutline,
} from '@mui/icons-material';
import useAuthStore from '../../store/useAuthStore';
import Friend from '../Friend/Friend';
import { Link } from 'react-router-dom';
import './sidebar.css';
import { useEffect } from 'react';
import useUserStore from '../../store/useUserStore';

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
				<ul className='sidebarList'>
					<li className='sidebarListItem'>
						<Link to={'/'}>
							<RssFeed htmlColor='#1877f2' className='sidebarIcon' />
							<span className='sidebarListItemText'>Новости</span>
						</Link>
					</li>
					<li className='sidebarListItem'>
						<Link to={'/chat'}>
							<Chat htmlColor='#1877f2' className='sidebarIcon' />
							<span className='sidebarListItemText'>Чат</span>
						</Link>
					</li>
					<li className='sidebarListItem'>
						<PlayCircleFilledOutlined
							htmlColor='#1877f2'
							className='sidebarIcon'
						/>
						<span className='sidebarListItemText'>Видео</span>
					</li>
					<li className='sidebarListItem'>
						<Group htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Группы</span>
					</li>
					<li className='sidebarListItem'>
						<WorkOutline htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Работа</span>
					</li>
					<li className='sidebarListItem'>
						<School htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Курсы</span>
					</li>
				</ul>
				<hr className='sidebarHr' />
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
