import {
	Chat,
	Group,
	PlayCircleFilledOutlined,
	RssFeed,
	School,
	WorkOutline,
} from '@mui/icons-material';
import { useUserStore } from '../../store/useUserStore';
import Friend from '../Friend/Friend';
import { Link } from 'react-router-dom';

import './sidebar.css';

const Sidebar = () => {
	// Получаем список пользователей из Zustand Store
	const users = useUserStore((state) => state.users);

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
					{users.map((user) => (
						<Friend key={user.id} user={user} />
					))}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
