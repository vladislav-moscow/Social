import { useEffect } from 'react';
import './friend.css';
import useUserStore from '../../store/useUserStore';
import { Link } from 'react-router-dom';

const Friend = ({ friendId }) => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	const fetchUser = useUserStore((state) => state.fetchUser);
	const getUserById = useUserStore((state) => state.getUserById);

	// Получаем данные друга из стора
	const friend = getUserById(friendId);

	useEffect(() => {
		if (!friend) {
			// Загружаем данные друга, если они еще не загружены
			fetchUser(friendId);
		}
	}, [friendId, friend, fetchUser]);

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
