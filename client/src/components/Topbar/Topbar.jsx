import { Chat, Notifications, Person, Search } from '@mui/icons-material';
import './topbar.css';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Topbar = () => {
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.getUser());

	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

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
				<Link to={`/profile/${user.username}`}>
				<img
					src={
						user.profilePicture
							? PF + user.profilePicture
							: PF + 'person/noAvatar.png'
					}
					alt='avatarPerson'
					className='topbarImg'
				/>
				</Link>
			</div>
		</div>
	);
};

export default Topbar;
