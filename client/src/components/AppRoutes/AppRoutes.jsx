import { Routes, Route } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import Home from '../../pages/Home/Home';
import Profile from '../../pages/Profile/Profile';
import Chat from '../../pages/Chat/Chat';

/** Корневой компонент приложения с роутами */
const AppRoutes = () => (
	<Routes>
		<Route path='/' element={<Home />} />
		<Route path='/login' element={<Login />} />
		<Route path='/register' element={<Register />} />
		<Route path='/profile/:username' element={<Profile />} />
		<Route path='/chat' element={<Chat />} />
	</Routes>
);

export default AppRoutes;
