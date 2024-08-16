import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./components/AppRoutes/AppRoutes";

//import Home from './pages/Home/Home';
//import Login from './pages/Login/Login';
//import Register from './pages/Register/Register';
//import Profile from './pages/Profile/Profile';

function App() {
	return (
		<Router>
      <AppRoutes />
    </Router>
	);
}

export default App;
