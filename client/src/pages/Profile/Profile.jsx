import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import Rightbar from '../../components/Rightbar/Rightbar';
import Feed from '../../components/Feed/Feed';
import PlaceIcon from '@mui/icons-material/Place';
import FmdBadOutlinedIcon from '@mui/icons-material/FmdBadOutlined';
import { useParams } from 'react-router';
import './profile.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
	const [user, setUser] = useState({});
	const username = useParams().username;
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axios.get(`/api/users?username=${username}`);
			setUser(res.data);
		};
		fetchUser();
	}, [username]);


	// Если пользователь не найден или данные еще загружаются, можно вернуть загрузочный индикатор или ничего не отображать
	if (!user) return null; // Можно заменить на индикатор загрузки

	return (
		<>
			<Topbar />
			<div className='profileContainer'>
				<Sidebar />
				<div className='profileRight'>
					<div className='profilrRightTop'>
						<div className='profileCover'>
							<img
								className='profileCoverImg'
								src={
									user.coverPicture
										? PF + user.coverPicture
										: PF + 'post/bg_default.jpg'
								}
								alt='ProfileBg'
							/>
							<img
								className='profileUserImg'
								src={
									user.profilePicture
										? PF + user.profilePicture
										: PF + 'person/noAvatar.png'
								}
								alt='ProfileAvatar'
							/>
						</div>
						<div className='profileInfoWrapper'>
							<div className='profileInfo'>
								<h4 className='profileInfoName'>{user.username}</h4>
								<span className='profileInfoDesc'>{user.desc}</span>
								<div className='profileInfoItem'>
									<div className='profileInfoCityWrapper'>
										<span className='profileInfoKey'>
											<PlaceIcon />
										</span>
										<span className='profileInfoValue'>
											{user.city ? user.city : 'нет данных'}
										</span>
									</div>
									<div className='profileInfoCityWrapper cursor'>
										<span className='profileInfoKey'>
											<FmdBadOutlinedIcon />
										</span>
										<span className='profileInfoValue'>Подробнее</span>
									</div>
								</div>
							</div>
							{username !== user.username && (
								<button className='profileFollowingBtn'>Подписаться</button>
							)}
						</div>
					</div>
					<div className='profileRightBottom'>
						<Feed username={username} />
						<Rightbar user={user} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
