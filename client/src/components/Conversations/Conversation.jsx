import { useEffect } from 'react';
import './conversation.css';
import useUserStore from '../../store/useUserStore';

/**
 * Компонент `Conversation` отображает информацию о собеседнике в беседе.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.conversation - Объект, содержащий данные о беседе.
 * @param {Array<string>} props.conversation.members - Массив идентификаторов участников беседы.
 * @param {Object} props.currentUser - Данные текущего пользователя.
 * @param {string} props.currentUser._id - Идентификатор текущего пользователя.
 *
 * @returns {JSX.Element} Компонент, отображающий информацию о собеседнике в беседе.
 */

const Conversation = ({ conversation, currentUser }) => {
	// Извлекаем функции для работы с пользователями из стора
	const { fetchUser, getUserById } = useUserStore();
	// Путь к публичной папке с ресурсами
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	// Находим ID собеседника (друга) в данной беседе, исключая текущего пользователя
	const friendId = conversation.members.find((m) => m !== currentUser._id);

	/**
	 * useEffect для загрузки данных пользователя по его ID при изменении friendId.
	 * Если данные пользователя не загружены, запрашиваем их.
	 */
	useEffect(() => {
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
				alt={user?.username}
			/>
			<span className='conversationName'>{user?.username}</span>
		</div>
	);
};

export default Conversation;
