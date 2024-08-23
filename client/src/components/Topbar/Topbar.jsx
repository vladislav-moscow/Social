import { Chat, Notifications, Person, Search } from '@mui/icons-material';
import './topbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';

const Topbar = () => {
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.getUser());
	// Состояние для управления отображением меню
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	// Получаем метод выхода пользователя из сети
	const logout = useAuthStore((state) => state.logout);
	// Используем useNavigate для перенаправления
	const navigate = useNavigate();
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	// Обработчик клика по изображению пользователя
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Закрываем меню при клике вне его области
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest('.topbarImg, .dropdownMenu')) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Обработчик выхода из системы
	const handleLogout = () => {
		logout(); // Вызываем действие logout
		navigate('/login'); // Перенаправляем на страницу входа
	};

	return (
		<div className='topbarContainer'>
			<div className='topbarLeft'>
				<Link to={'/'} className='logo'>
					<span className='logo'>SocialApp</span>
				</Link>
			</div>
			<div className='topbarCenter'>
				<div className='searchbar'>
					<Search className='searchIcon' />
					<input
						placeholder='Поиск друзей, постов или видео'
						className='searchInput'
					/>
				</div>
			</div>
			<div className='topbarRight'>
				<div className='topbarLinks'>
					{/*<span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>*/}
				</div>
				<div className='topbarIcons'>
					<div className='topbarIconItem'>
						<Person />
						<span className='topbarIconBadge'>1</span>
					</div>
					<div className='topbarIconItem'>
						<Chat />
						<span className='topbarIconBadge'>2</span>
					</div>
					<div className='topbarIconItem'>
						<Notifications />
						<span className='topbarIconBadge'>1</span>
					</div>
				</div>
				<div className='topbarProfile'>
					<img
						src={
							user.profilePicture
								? PF + user.profilePicture
								: PF + 'person/noAvatar.png'
						}
						alt='avatarPerson'
						className='topbarImg'
						onClick={toggleMenu}
					/>
					{/* Отображаем меню при необходимости */}
					{isMenuOpen && (
						<div className='dropdownMenu'>
							<Link to={`/profile/${user.username}`} className='menuItem'>
								Профиль
							</Link>
							<span className='menuItem' onClick={handleLogout}>
								Выйти
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Topbar;
