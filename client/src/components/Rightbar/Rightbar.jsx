import { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import './rightbar.css';
import useUserStore from '../../store/useUserStore';
import Online from '../Online/Online';
import Friend from '../Friend/Friend';
import Advertisement from '../Advertisement/Advertisement';

/**
 * Компонент `Rightbar` отображает боковую панель с информацией о пользователе или списком онлайн-друзей и рекламой.
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.user - Данные пользователя, чья страница профиля отображается.
 * @param {Object} props.currentUser - Данные текущего авторизованного пользователя.
 * @returns {JSX.Element} - Рендерит боковую панель.
 */

const Rightbar = ({ user, currentUser }) => {
	const [onlineFriends, setOnlineFriends] = useState([]); // Локальный стейт для онлайн-друзей
	const [followers, setFollowers] = useState([]); // Локальный стейт для подписчиков
	const onlineUsers = useAuthStore((state) => state.onlineUsers); // Список онлайн-пользователей из Zustand store
	const { users, fetchFollowers, getUserById } = useUserStore((state) => ({
		users: state.users, // Список пользователей из Zustand store
		fetchFollowers: state.fetchFollowers, // Функция для загрузки подписчиков пользователя
		getUserById: state.getUserById, // Функция для получения пользователя по ID
	}));

	/**
	 * Эффект для обновления списка онлайн-друзей при изменении списка пользователей или состояния онлайн-пользователей.
	 */
	useEffect(() => {
		if (currentUser) {
			// Фильтруем список друзей, исключая текущего пользователя
			const friendsArray = Object.values(users).filter(
				(user) => user._id !== currentUser._id && onlineUsers.includes(user._id)
			);

			setOnlineFriends(friendsArray); // Обновляем состояние онлайн-друзей
		}
	}, [users, onlineUsers, currentUser, user]);

	/**
	 * Эффект для загрузки подписчиков пользователя при изменении данных пользователя.
	 */
	useEffect(() => {
		if (user && user._id) {
			fetchFollowers(user._id); // Загружаем подписчиков пользователя
		}
	}, [user, fetchFollowers]);

	/**
	 * Эффект для обновления списка подписчиков после их загрузки.
	 */
	useEffect(() => {
		if (user && user.followers) {
			const followersArray = user.followers.map((followerId) => getUserById(followerId)).filter(Boolean);
			setFollowers(followersArray); // Обновляем состояние подписчиков
		}
	}, [user, users, getUserById]);

	/**
	 * Компонент отображает список онлайн-друзей и рекламу на домашней странице.
	 * @returns {JSX.Element} - Элементы домашней панели.
	 */

	const HomeRightbar = () => {
		return (
			<>
				<h4 className='rightbarTitle'>В сети:</h4>
				<ul className='rightbarFriendList'>
					{onlineFriends.map((user) => (
						<div key={user._id}>
							<Online user={user} />
						</div>
					))}
				</ul>
				<Advertisement />
				<Advertisement />
			</>
		);
	};

	/**
	 * Компонент отображает информацию о пользователе и список подписчиков на странице профиля.
	 * @returns {JSX.Element} - Элементы профиля.
	 */
	
	const ProfileRightbar = () => {
		return (
			<>
				<h4 className='rightbarTitle'>Информация о пользователе</h4>
				<div className='rightbarInfo'>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Город:</span>
						<span className='rightbarInfoValue'>
							{user.city ? user.city : 'нет данных'}
						</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Родной город:</span>
						<span className='rightbarInfoValue'>
							{user.from ? user.from : 'нет данных'}
						</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Семейное положение:</span>
						<span className='rightbarInfoValue'>
							{user.relationship === 1
								? 'Свободен/на'
								: user.relationship === 2
								? 'Женат/Замужем'
								: user.relationship === 3
								? 'В отношениях'
								: 'нет данных'}
						</span>
					</div>
				</div>
				<h4 className='rightbarTitle'>Подписчики</h4>
				<div className='rightbarFollowings'>
					<div className='rightbarFollowing'>
						{/* Отображаем подписчиков пользователя */}
						{followers.length > 0 ? (
							followers.map((follower) => (
								<Friend key={follower._id} friend={follower} /> // Передаем объект подписчика в компонент Friend
							))
						) : (
							<p>У вас пока нет подписчиков.</p>
						)}
					</div>
				</div>
			</>
		);
	};
	return (
		<div className='rightbar'>
			<div className='rightbarWrapper'>
				{user ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
};

export default Rightbar;
