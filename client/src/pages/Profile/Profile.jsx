import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import Rightbar from '../../components/Rightbar/Rightbar';
import Feed from '../../components/Feed/Feed';
import PlaceIcon from '@mui/icons-material/Place';
import FmdBadOutlinedIcon from '@mui/icons-material/FmdBadOutlined';
import { useParams, useNavigate } from 'react-router';
import './profile.css';
import { useEffect, useState } from 'react';
import useUserStore from '../../store/useUserStore';
import useAuthStore from '../../store/useAuthStore';
import useConversationStore from '../../store/useConversationStore'; // Импортируем useConversationStore
import axios from 'axios';

/**
 * Компонент для отображения профиля пользователя.
 * @returns {JSX.Element|null} - Возвращает JSX элемент с информацией о пользователе или null, если данные не загружены.
 */
const Profile = () => {
	// Получаем имя пользователя из параметров маршрута
	const { username } = useParams();
	const navigate = useNavigate(); // Для навигации
	const PF = import.meta.env.VITE_PUBLIC_FOLDER; // Путь к публичной папке для загрузки изображений

	// Получаем текущего пользователя (залогиненного) и функции для подписки/отписки из стора
	const currentUser = useAuthStore((state) => state.user);
	const followUser = useAuthStore((state) => state.follow);
	const unfollowUser = useAuthStore((state) => state.unfollow);

	// Получаем данные пользователя по имени пользователя и функцию для их загрузки из стора
	const user = useUserStore((state) => state.getUserByUsername(username));
	const fetchUserByUsername = useUserStore(
		(state) => state.fetchUserByUsername
	);

	const { createConversation, getConversation } = useConversationStore(
		(state) => ({
			createConversation: state.createConversation,
			getConversation: state.getConversation,
		})
	);

	const [followed, setFollowed] = useState(false); // Локальное состояние для отслеживания подписки

	// Загружаем данные пользователя, если они еще не загружены
	useEffect(() => {
		if (!user) {
			fetchUserByUsername(username);
		}
	}, [username, user, fetchUserByUsername]);

	// Определяем состояние подписки при загрузке данных пользователя
	useEffect(() => {
		if (user && currentUser) {
			setFollowed(currentUser.followings.includes(user._id));
		}
	}, [user, currentUser]);

	/**
	 * Обработчик клика для подписки или отписки от пользователя.
	 * Выполняет запрос на сервер для изменения статуса подписки и обновляет состояние.
	 */
	const handleClick = async () => {
		try {
			if (followed) {
				const response = await axios.put(`/api/users/${user._id}/unfollow`, {
					userId: currentUser._id,
				});
				if (response.status === 200) {
					unfollowUser(user._id); // Обновляем состояние в store
					setFollowed(false); // Обновляем локальное состояние
				} else {
					console.error('Ошибка при отписке:', response);
				}
			} else {
				const response = await axios.put(`/api/users/${user._id}/follow`, {
					userId: currentUser._id,
				});
				if (response.status === 200) {
					followUser(user._id); // Обновляем состояние в store
					setFollowed(true); // Обновляем локальное состояние
				} else {
					console.error('Ошибка при подписке:', response);
				}
			}
		} catch (err) {
			console.error('Ошибка при выполнении запроса:', err);
		}
	};

	// Функция для создания или получения беседы и перехода на страницу чата
	const handleMessageClick = async () => {
		if (currentUser._id !== user._id) {
			try {
				// Проверяем, существует ли беседа
				const existingConversation = await getConversation(
					currentUser._id,
					user._id
				);
				if (existingConversation) {
					// Сохраняем текущую беседу и переходим на страницу чата
					useConversationStore.getState().saveCurrentChat(existingConversation);
					navigate(`/chat`);
				} else {
					// Создаем новую беседу и переходим на страницу чата
					const newConversation = await createConversation(
						currentUser._id,
						user._id
					);
					if (newConversation) {
						navigate(`/chat`);
					}
				}
			} catch (err) {
				console.error('Ошибка при обработке беседы:', err);
			}
		}
	};

	// Если данные пользователя еще не загружены, возвращаем null
	if (!user) return null;

	return (
		<>
			<Topbar />
			<div className='profileContainer'>
				<Sidebar />
				<div className='profileRight'>
					<div className='profilrRightTop'>
						<div className='profileCover'>
							<img
								className='profileCoverImg'
								src={
									user.coverPicture
										? PF + user.coverPicture
										: PF + 'post/bg_default.jpg'
								}
								alt='ProfileBg'
							/>
							<img
								className='profileUserImg'
								src={
									user.profilePicture
										? PF + user.profilePicture
										: PF + 'person/noAvatar.png'
								}
								alt='ProfileAvatar'
							/>
						</div>
						<div className='profileInfoWrapper'>
							<div className='profileInfo'>
								<h4 className='profileInfoName'>{user.username}</h4>
								<span className='profileInfoDesc'>{user.desc}</span>
								<div className='profileInfoItem'>
									<div className='profileInfoCityWrapper'>
										<span className='profileInfoKey'>
											<PlaceIcon />
										</span>
										<span className='profileInfoValue'>
											{user.city ? user.city : 'нет данных'}
										</span>
									</div>
									<div className='profileInfoCityWrapper cursor'>
										<span className='profileInfoKey'>
											<FmdBadOutlinedIcon />
										</span>
										<span className='profileInfoValue'>Подробнее</span>
									</div>
								</div>
							</div>
							{currentUser.username !== user.username && (
								<div className='profileBtnWrapper'>
									<button className='profileFollowingBtn' onClick={handleClick}>
										{followed ? 'Отписаться' : 'Подписаться'}
									</button>
									<button
										className='profileMessageBtn'
										onClick={handleMessageClick}
									>
										Написать сообщение
									</button>
								</div>
							)}
						</div>
					</div>
					<div className='profileRightBottom'>
						<Feed username={username} />
						<Rightbar user={user} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
