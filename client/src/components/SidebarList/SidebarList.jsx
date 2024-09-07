import './sidebarList.css';
import { Skeleton } from '@mui/material';
import {
	Chat,
	Group,
	PlayCircleFilledOutlined,
	RssFeed,
	School,
	WorkOutline,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * Компонент `SidebarList` отображает навигационный список боковой панели.
 * @param {Object} props - Свойства компонента.
 * @param {boolean} props.isLoading - Флаг, указывающий на состояние загрузки данных.
 * @returns {JSX.Element} - Компонент боковой панели с навигационным списком.
 */

const SidebarList = ({ isLoading }) => {
	return (
		<>
			{isLoading ? (
				<div className='sidebarList'>
					{[...Array(6)].map((_, index) => (
						<Skeleton
							key={index}
							variant='rectangular'
							width='30%'
							height={26}
							sx={{ mb: 2 }}
						/>
					))}
				</div>
			) : (
				<ul className='sidebarList'>
					<li className='sidebarListItem'>
						<Link to={'/'}>
							<RssFeed htmlColor='#8a2667' className='sidebarIcon' />
							<span className='sidebarListItemText'>Лента</span>
						</Link>
					</li>
					<li className='sidebarListItem'>
						<Link to={'/chat'}>
							<Chat htmlColor='#8a2667' className='sidebarIcon' />
							<span className='sidebarListItemText'>Чат</span>
						</Link>
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
				</ul>
			)}
			<hr className='sidebarHr' />
		</>
	);
};

export default SidebarList;
