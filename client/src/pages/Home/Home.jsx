import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Rightbar from "../../components/Rightbar/Rightbar";
import Feed from "../../components/Feed/Feed";
import "./home.css";
import useAuthStore from "../../store/useAuthStore";

function Home() {
	
	const user = useAuthStore((state) => state.getUser());

	
	return (
		<>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed/>
        <Rightbar currentUser={user}/>
      </div>
    </>
	)
}

export default Home;
