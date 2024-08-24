import { useEffect } from 'react';
import './friend.css';
import useUserStore from '../../store/useUserStore';
import { Link } from 'react-router-dom';

/**
 * Компонент для отображения информации о друге.
 * @param {Object} props - Свойства компонента.
 * @param {string} props.friendId - ID друга, чьи данные нужно загрузить и отобразить.
 * @returns {JSX.Element|null} - Возвращает JSX элемент с информацией о друге или null, если данные не загружены.
 */
const Friend = ({ friendId }) => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER; // Путь к публичной папке для загрузки изображений.

	// Получаем функции из стора пользователей для загрузки и получения данных пользователя.
	const fetchUser = useUserStore((state) => state.fetchUser); // Функция для загрузки данных пользователя по его ID.
	const getUserById = useUserStore((state) => state.getUserById); // Функция для получения данных пользователя из состояния стора.

	// Получаем данные друга из стора по переданному ID.
	const friend = getUserById(friendId);

	// Используем useEffect для загрузки данных друга, если они еще не загружены.
	useEffect(() => {
		if (!friend) {
			// Если данные друга еще не загружены, вызываем fetchUser для их получения.
			fetchUser(friendId);
		}
	}, [friendId, friend, fetchUser]); // Зависимости useEffect включают friendId, состояние друга и функцию fetchUser.

	// Если данные друга еще не загружены, возвращаем null (не отображаем компонент).
	if (!friend) return null;

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
