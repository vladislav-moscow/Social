import { Bookmark, Chat, Event, Group, HelpOutline, PlayCircleFilledOutlined, RssFeed, School, WorkOutline } from '@mui/icons-material';
import './sidebar.css';
import { Users } from '../../Data';
import Friend from '../Friend/Friend';

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<div className='sidebarWrapper'>
				<ul className='sidebarList'>
					<li className='sidebarListItem'>
						<RssFeed htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Новости</span>
					</li>
					<li className='sidebarListItem'>
						<Chat htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Чат</span>
					</li>
					<li className='sidebarListItem'>
						<PlayCircleFilledOutlined htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Видео</span>
					</li>
					<li className='sidebarListItem'>
						<Group htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Группы</span>
					</li>
					<li className='sidebarListItem'>
						<Bookmark htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Закладки</span>
					</li>
					<li className='sidebarListItem'>
						<HelpOutline htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Вопросы</span>
					</li>
					<li className='sidebarListItem'>
						<WorkOutline htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Работа</span>
					</li>
					<li className='sidebarListItem'>
						<Event htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>События</span>
					</li>
					<li className='sidebarListItem'>
						<School htmlColor='#1877f2' className='sidebarIcon' />
						<span className='sidebarListItemText'>Курсы</span>
					</li>
				</ul>
				<hr className='sidebarHr' />
				<ul className='sidebarFriendList'>
				{Users.map((user) => (
            <Friend key={user.id} user={user} />
          ))}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
