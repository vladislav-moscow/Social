import "./sidebarList.css";
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
		</>
	);
}

export default SidebarList;
