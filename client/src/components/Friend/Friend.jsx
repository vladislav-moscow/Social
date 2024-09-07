import './friend.css';
import { Link } from 'react-router-dom';

/**
 * Компонент `Friend` отображает информацию о друге и предоставляет ссылку на его профиль.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.friend - Объект, содержащий информацию о друге.
 * @param {string} props.friend.username - Имя пользователя друга.
 * @param {string} props.friend.profilePicture - URL изображения профиля друга.
 *
 * @returns {JSX.Element|null} - Возвращает JSX элемент с информацией о друге или null, если данные не переданы.
 */
const Friend = ({ friend }) => {
	// Путь к публичной папке для загрузки изображений.
	const PF = import.meta.env.VITE_PUBLIC_FOLDER; 
	// Если данные друга не переданы, возвращаем null (не отображаем компонент).
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
