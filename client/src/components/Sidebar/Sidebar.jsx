import {
	Chat,
	Group,
	PlayCircleFilledOutlined,
	RssFeed,
	School,
	WorkOutline,
} from '@mui/icons-material';
import useAuthStore from '../../store/useAuthStore';
import Friend from '../Friend/Friend';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
	// Получаем текущего пользователя из Zustand Store
	const user = useAuthStore((state) => state.user);

	return (
		<div className='sidebar'>
			<div className='sidebarWrapper'>
				<ul className='sidebarList'>
					<li className='sidebarListItem'>
						<Link to={'/'}>
							<RssFeed htmlColor='#1877f2' className='sidebarIcon' />
							<span className='sidebarListItemText'>Новости</span>
						</Link>
					</li>
					<li className='sidebarListItem'>
						<Link to={'/chat'}>
							<Chat htmlColor='#1877f2' className='sidebarIcon' />
							<span className='sidebarListItemText'>Чат</span>
						</Link>
					</li>
					<li className='sidebarListItem'>
						<PlayCircleFilledOutlined
							htmlColor='#1877f2'
							className='sidebarIcon'
						/>
						<span className='sidebarListItemText'>Видео</span>
					</li>
					<li className='sidebarListItem'>
						<Group htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Группы</span>
					</li>
					<li className='sidebarListItem'>
						<WorkOutline htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Работа</span>
					</li>
					<li className='sidebarListItem'>
						<School htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Курсы</span>
					</li>
				</ul>
				<hr className='sidebarHr' />
				<h2 className='sidebarMyFriend'>Мои друзья:</h2>
				<ul className='sidebarFriendList'>
					{/* Проверяем, есть ли друзья у пользователя */}
					{user.followers && user.followers.length > 0 ? (
						user.followers.map((friendId) => (
							<Friend key={friendId} friendId={friendId} />
						))
					) : (
						<p>У вас пока нет друзей.</p>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
