import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import Rightbar from '../../components/Rightbar/Rightbar';
import Feed from '../../components/Feed/Feed';
import './home.css';
import useAuthStore from '../../store/useAuthStore';

/**
 * Компонент страницы домашней ленты.
 *
 * Отображает верхнюю панель навигации (`Topbar`), боковую панель (`Sidebar`),
 * основную ленту контента (`Feed`) и правую панель (`Rightbar`).
 *
 * @returns {JSX.Element} Компонент страницы домашней ленты.
 */

function Home() {
	// Получаем текущего пользователя из глобального состояния.
	const user = useAuthStore((state) => state.getUser());

	return (
		<>
			<Topbar />
			<div className='homeContainer'>
				<Sidebar />
				<Feed />
				<Rightbar currentUser={user} />
			</div>
		</>
	);
}

export default Home;
