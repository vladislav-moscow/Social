import { useEffect, useState, useCallback, useMemo } from 'react';
import './chatOnline.css';
import useUserStore from '../../store/useUserStore';
import useConversationStore from '../../store/useConversationStore';

/**
 * Компонент `ChatOnline` отображает список онлайн-друзей и позволяет начать беседу с ними.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Array<string>} props.onlineUsers - Список идентификаторов пользователей, которые в данный момент онлайн.
 * @param {string} props.currentId - Идентификатор текущего пользователя.
 * @param {Function} props.setCurrentChat - Функция для установки текущей беседы.
 *
 * @returns {JSX.Element} Компонент, отображающий онлайн-друзей и предоставляющий возможность начать с ними беседу.
 */
const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
	//Константа для хранения базового пути к изображениям.
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	//Состояние для хранения списка онлайн-друзей.
	const [onlineFriends, setOnlineFriends] = useState([]);
	// Извлечение состояния и методов из Zustand store для управления пользователями
	const { users } = useUserStore((state) => ({
		users: state.users,
		fetchFriends: state.fetchFriends,
	}));
	// Извлечение методов из Zustand store для управления беседами
	const { fetchConversations, getConversation, createConversation } =
		useConversationStore((state) => ({
			fetchConversations: state.fetchConversations,
			getConversation: state.getConversation,
			createConversation: state.createConversation,
		}));

	/**
	 * Эффект для загрузки всех бесед текущего пользователя при изменении `currentId`.
	 */
	useEffect(() => {
		fetchConversations(currentId);
	}, [currentId, fetchConversations]);

	/**
	 * Эффект для обновления списка онлайн-друзей на основе состояния `users` и `onlineUsers`.
	 */
	useEffect(() => {
		// Фильтруем пользователей, чтобы получить только онлайн-друзей, исключая текущего пользователя
		const friendsArray = Object.values(users).filter(
			(user) => user._id !== currentId && onlineUsers.includes(user._id)
		);
		setOnlineFriends(friendsArray);
	}, [users, onlineUsers, currentId]);

	/**
	 * Обработчик клика по другу. Проверяет наличие беседы и создает её, если необходимо.
	 *
	 * @param {Object} user - Пользователь, с которым нужно начать беседу.
	 * @returns {Promise<void>}
	 */
	const handleClick = useCallback(
		async (user) => {
			try {
				// Проверяем, существует ли беседа между текущим пользователем и выбранным другом
				const existingConversation = await getConversation(currentId, user._id);

				if (existingConversation) {
					// Если беседа существует, устанавливаем её как текущую
					setCurrentChat(existingConversation);
				} else {
					// Создаем новую беседу, если её нет
					const newConversation = await createConversation(currentId, user._id);
					setCurrentChat(newConversation);
				}
			} catch (err) {
				// Логируем ошибку в случае сбоя
				console.error('Нажмите кнопку "Обработка ошибок', err);
			}
		},
		[currentId, setCurrentChat, getConversation, createConversation]
	);

	// Мемоизация онлайн друзей для предотвращения ненужных перерисовок
	const memoizedOnlineFriends = useMemo(() => onlineFriends, [onlineFriends]);

	return (
		<div className='chatOnline'>
			{memoizedOnlineFriends.map((friend) => (
				<div
					key={friend._id}
					className='chatOnlineFriend'
					onClick={() => handleClick(friend)}
				>
					<div className='chatOnlineImgContainer'>
						<img
							className='chatOnlineImg'
							src={
								friend?.profilePicture
									? `${PF}${friend.profilePicture}`
									: `${PF}person/noAvatar.png`
							}
							alt={friend.username}
						/>
						<div className='chatOnlineBadge'></div>
					</div>
					<span className='chatOnlineName'>{friend.username}</span>
				</div>
			))}
		</div>
	);
};

export default ChatOnline;
