import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import Rightbar from '../../components/Rightbar/Rightbar';
import Feed from '../../components/Feed/Feed';

import './profile.css';

const Profile = () => {
	return (
		<>
			<Topbar />
			<div className='profileContainer'>
				<Sidebar />
				<div className='profileRight'>
					<div className='profilrRightTop'>
					<div className="profileCover">
              <img
                className="profileCoverImg"
                src="assets/post/3.jpg"
                alt=""
              />
              <img
                className="profileUserImg"
                src="assets/person/7.jpg"
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">Safak Kocaoglu</h4>
                <span className="profileInfoDesc">Hello my friends!</span>
            </div>
					</div>
					<div className='profileRightBottom'>
						<Feed />
						<Rightbar profile />
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
