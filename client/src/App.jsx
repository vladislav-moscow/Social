import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./components/AppRoutes/AppRoutes";
import socket from './utils/socket.js'; 
import { useEffect } from 'react';
import useAuthStore from "./store/useAuthStore.js";


//import Home from './pages/Home/Home';
//import Login from './pages/Login/Login';
//import Register from './pages/Register/Register';
//import Profile from './pages/Profile/Profile';

function App() {
	const user = useAuthStore((state) => state.getUser());
  const setOnlineUsers = useAuthStore((state) => state.setOnlineUsers);

	useEffect(() => {
    if (user) {
      socket.emit('addUser', user._id);

      socket.on('getUsers', (users) => {
        setOnlineUsers(users.map((user) => user.userId));
      });
    }

    return () => {
      if (user) {
        socket.emit('removeUser', user._id);
      }
      socket.off('getUsers');
    };
  }, [user, setOnlineUsers]);
	return (
		<Router>
      <AppRoutes user={user}/>
    </Router>
	);
}

export default App;
