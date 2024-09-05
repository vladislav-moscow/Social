import './sidebarList.css';
import {
	Chat,
	Group,
	PlayCircleFilledOutlined,
	RssFeed,
	School,
	WorkOutline,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SidebarList = () => {
	return (
		<>
			<ul className='sidebarList'>
				<li className='sidebarListItem'>
					<Link to={'/'}>
						<RssFeed htmlColor='#8a2667' className='sidebarIcon' />
						<span className='sidebarListItemText'>Новости</span>
					</Link>
				</li>
				<li className='sidebarListItem'>
					<Link to={'/chat'}>
						<Chat htmlColor='#8a2667' className='sidebarIcon' />
						<span className='sidebarListItemText'>Чат</span>
					</Link>
				</li>
				<li className='sidebarListItem'>
					<PlayCircleFilledOutlined
						htmlColor='#8a2667'
						className='sidebarIcon'
					/>
					<span className='sidebarListItemText'>Видео</span>
				</li>
				<li className='sidebarListItem'>
					<Group htmlColor='#8a2667' className='sidebarIcon' />
					<span className='sidebarListItemText'>Группы</span>
				</li>
				<li className='sidebarListItem'>
					<Link to={'/job'}>
						<WorkOutline htmlColor='#8a2667' className='sidebarIcon' />
						<span className='sidebarListItemText'>Работа</span>
					</Link>
				</li>
				<li className='sidebarListItem'>
					<Link to={'/course'}>
						<School htmlColor='#8a2667' className='sidebarIcon' />
						<span className='sidebarListItemText'>Курсы</span>
					</Link>
				</li>
			</ul>
			<hr className='sidebarHr' />
		</>
	);
};

export default SidebarList;
