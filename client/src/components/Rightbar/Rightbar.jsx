import './rightbar.css';
import { useUserStore } from '../../store/useUserStore';
import Online from '../Online/Online';


const Rightbar = ({ user }) => {
	// Получаем список пользователей из Zustand Store
  const users = useUserStore((state) => state.users);

	const HomeRightbar = () => {
		return (
			<>
				
				<h4 className='rightbarTitle'>В сети:</h4>
				<ul className='rightbarFriendList'>
				{users.map((user) => (
            <Online key={user.id} user={user} />
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
						<span className='rightbarInfoValue'>{user.city}</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Родной город:</span>
						<span className='rightbarInfoValue'>{user.from}</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Семейное положение:</span>
						<span className='rightbarInfoValue'>{user.relationship === 1 ? "Свободен/на" : user.relationship === 2 ? "Женат/Замужем" : user.relationship === 3 ? "В отношениях" : "нет данных"}</span>
					</div>
				</div>
				<h4 className='rightbarTitle'>User friends</h4>
				<div className='rightbarFollowings'>
					<div className='rightbarFollowing'>
						<img
							src='assets/person/1.jpg'
							alt=''
							className='rightbarFollowingImg'
						/>
						<span className='rightbarFollowingName'>John Carter</span>
					</div>
					<div className='rightbarFollowing'>
						<img
							src='assets/person/2.jpg'
							alt=''
							className='rightbarFollowingImg'
						/>
						<span className='rightbarFollowingName'>John Carter</span>
					</div>
					<div className='rightbarFollowing'>
						<img
							src='assets/person/3.jpg'
							alt=''
							className='rightbarFollowingImg'
						/>
						<span className='rightbarFollowingName'>John Carter</span>
					</div>
					<div className='rightbarFollowing'>
						<img
							src='assets/person/4.jpg'
							alt=''
							className='rightbarFollowingImg'
						/>
						<span className='rightbarFollowingName'>John Carter</span>
					</div>
					<div className='rightbarFollowing'>
						<img
							src='assets/person/5.jpg'
							alt=''
							className='rightbarFollowingImg'
						/>
						<span className='rightbarFollowingName'>John Carter</span>
					</div>
					<div className='rightbarFollowing'>
						<img
							src='assets/person/6.jpg'
							alt=''
							className='rightbarFollowingImg'
						/>
						<span className='rightbarFollowingName'>John Carter</span>
					</div>
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
}

export default Rightbar;