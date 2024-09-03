import './online.css';

/**
 * Компонент `Online` отображает информацию о пользователе, который в данный момент онлайн.
 * 
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.user - Пользователь, которого нужно отобразить.
 * @returns {JSX.Element} Компонент, отображающий информацию о пользователе.
 */
const Online = ({ user }) => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <li className='rightbarFriend'>
      <div className='rightbarProfileImgContainer'>
        <img
          className='rightbarProfileImg'
          src={user.profilePicture ? `${PF}${user.profilePicture}` : `${PF}person/noAvatar.png`}
          alt={user.username}
        />
        <span className='rightbarOnline'></span>
      </div>
      <span className='rightbarUsername'>{user.username}</span>
    </li>
  );
};

export default Online;
