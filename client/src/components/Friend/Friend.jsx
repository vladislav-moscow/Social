import { useEffect } from 'react';
import './friend.css';
import useUserStore from '../../store/useUserStore';
import { Link } from 'react-router-dom';

/**
 * Компонент для отображения информации о друге.
 * @param {string} friendId - ID друга, чьи данные нужно загрузить и отобразить.
 */
const Friend = ({ friendId }) => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER; // Путь к публичной папке для загрузки изображений.
	const fetchUser = useUserStore((state) => state.fetchUser); // Функция для загрузки данных пользователя.
	const getUserById = useUserStore((state) => state.getUserById); // Функция для получения данных пользователя по его ID.

	// Получаем данные друга из стора
	const friend = getUserById(friendId);

	// Используем useEffect для загрузки данных друга, если они еще не загружены.
	useEffect(() => {
		if (!friend) {
			// Загружаем данные друга, если они не найдены в состоянии.
			fetchUser(friendId);
		}
	}, [friendId, friend, fetchUser]); // Зависимости включают friendId, friend и fetchUser.

	if (!friend) return null; // Возвращаем null, если друг еще не загружен

	return (
		<li className='sidebarFriend'>
			<Link to={`/profile/${friend.username}`}>
				<img
					className='sidebarFriendImg'
					src={
						friend.profilePicture
							? PF + friend.profilePicture
							: PF + 'person/noAvatar.png'
					}
					alt={friend.username}
				/>
				<span className='sidebarFriendName'>{friend.username}</span>
			</Link>
		</li>
	);
};

export default Friend;
