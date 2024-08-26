import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import Home from '../../pages/Home/Home';
import Profile from '../../pages/Profile/Profile';
import Chat from '../../pages/Chat/Chat';
import useAuthStore from '../../store/useAuthStore'; // Путь к вашему Zustand store

/** Корневой компонент приложения с роутами */
const AppRoutes = () => {
	const { user } = useAuthStore(); // Получаем пользователя из Zustand store

	return (
		<Routes>
			<Route path='/' element={user ? <Home /> : <Register />} />
			<Route
				path='/login'
				element={!user ? <Navigate to='/' replace /> : <Login />}
			/>
			<Route
				path='/register'
				element={user ? <Navigate to='/' replace /> : <Register />}
			/>
			<Route path='/profile/:username' element={<Profile />} />
			<Route
				path='/chat'
				element={!user ? <Navigate to='/' replace /> : <Chat />}
			/>
		</Routes>
	);
};

export default AppRoutes;
