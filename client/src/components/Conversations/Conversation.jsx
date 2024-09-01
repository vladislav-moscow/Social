import { useEffect } from 'react';
import './conversation.css';
import useUserStore from '../../store/useUserStore';

const Conversation = ({ conversation, currentUser }) => {
	// Извлекаем функции для работы с пользователями из стора
	const { fetchUser, getUserById } = useUserStore();
	// Путь к публичной папке с ресурсами
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	// Находим ID собеседника (друга) в данной беседе, исключая текущего пользователя
	const friendId = conversation.members.find((m) => m !== currentUser._id);

	// useEffect используется для загрузки данных пользователя по его ID
	useEffect(() => {
		// Если данные пользователя не загружены, запрашиваем их
		fetchUser(friendId);
	}, [friendId, fetchUser]); 

	// Получаем данные пользователя из стора по его ID
	const user = getUserById(friendId);

	return (
		<div className='conversation'>
			<img
				className='conversationImg'
				src={
					user?.profilePicture
						? PF + user.profilePicture
						: PF + 'person/noAvatar.png'
				}
				alt=''
			/>
			<span className='conversationName'>{user?.username}</span>
		</div>
	);
};

export default Conversation;
