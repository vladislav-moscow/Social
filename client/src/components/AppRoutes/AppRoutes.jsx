import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import Home from '../../pages/Home/Home';
import Profile from '../../pages/Profile/Profile';
import Chat from '../../pages/Chat/Chat';
import Job from '../../pages/Job/Job';
import Course from '../../pages/Course/Course';

/** Корневой компонент приложения с роутами */
const AppRoutes = ({user}) => {

	return (
		<Routes>
			<Route path='/' element={user ? <Home /> : <Register />} />
			<Route
				path='/login'
				element={user ? <Navigate to='/' replace /> : <Login />}
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
			<Route path='/job' element={user ? <Job /> : <Register />} />
			<Route path='/course' element={user ? <Course /> : <Register />} />
		</Routes>
	);
};

export default AppRoutes;
