import './rightbar.css';
import { useUserStore } from '../../store/useUserStore';
import Online from '../Online/Online';


const Rightbar = ({ profile }) => {
	// Получаем список пользователей из Zustand Store
  const users = useUserStore((state) => state.users);

	const HomeRightbar = () => {
		return (
			<>
				<div className='birthdayContainer'>
					<img className='birthdayImg' src='assets/gift.png' alt='' />
					<span className='birthdayText'>
						<b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
					</span>
				</div>
				<img className='rightbarAd' src='assets/ad.png' alt='' />
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
						<span className='rightbarInfoValue'>Москва</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>From:</span>
						<span className='rightbarInfoValue'>Madrid</span>
					</div>
					<div className='rightbarInfoItem'>
						<span className='rightbarInfoKey'>Семейное положение:</span>
						<span className='rightbarInfoValue'>Свободен/на</span>
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
				{profile ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
}

export default Rightbar;