import { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import './rightbar.css';
import useUserStore from '../../store/useUserStore';
import Online from '../Online/Online';

const Rightbar = ({ user, currentUser }) => {
	const onlineUsers = useAuthStore((state) => state.onlineUsers);
	const [onlineFriends, setOnlineFriends] = useState([]);
	const { users } = useUserStore((state) => ({
		users: state.users,
	}));

	useEffect(() => {
		if (currentUser) {
			// Фильтрация списка друзей, исключая текущего пользователя
			const friendsArray = Object.values(users).filter(
				(user) => user._id !== currentUser._id && onlineUsers.includes(user._id)
			);

			setOnlineFriends(friendsArray);
		}
	}, [users, onlineUsers, currentUser, user]);

	const HomeRightbar = () => {
		return (
			<>
				<h4 className='rightbarTitle'>В сети:</h4>
				<ul className='rightbarFriendList'>
					{onlineFriends.map((user) => (
						<div key={user._id}>
							<Online user={user} />
						</div>
					))}
				</ul>
			</>
		);
	};

	const ProfileRightbar = () => {
		return (
			<>
				<h4 className='rightbarTitle'>Информация о пользователе</h4>
				<div className='rightbarInfo'>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Город:</span>
						<span className='rightbarInfoValue'>
							{user.city ? user.city : 'нет данных'}
						</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Родной город:</span>
						<span className='rightbarInfoValue'>
							{user.from ? user.from : 'нет данных'}
						</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Семейное положение:</span>
						<span className='rightbarInfoValue'>
							{user.relationship === 1
								? 'Свободен/на'
								: user.relationship === 2
								? 'Женат/Замужем'
								: user.relationship === 3
								? 'В отношениях'
								: 'нет данных'}
						</span>
					</div>
				</div>
				<h4 className='rightbarTitle'>Подписчики</h4>
				<div className='rightbarFollowings'>
					<div className='rightbarFollowing'></div>
				</div>
			</>
		);
	};
	return (
		<div className='rightbar'>
			<div className='rightbarWrapper'>
				{user ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
};

export default Rightbar;
