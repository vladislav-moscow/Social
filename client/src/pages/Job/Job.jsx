import "./job.css";
import Topbar from '../../components/Topbar/Topbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Rightbar from '../../components/Rightbar/Rightbar';
import JobFeed from "../../components/JobFeed/JobFeed";

/**
 * Компонент страницы "Работа".
 * 
 * Отображает страницу с элементами верхней панели, боковой панели, основной ленты работы и правой панели.
 * 
 * @returns {JSX.Element} Компонент страницы "Работа".
 */

const Job = () => {
	return (
		<>
      <Topbar />
      <div className="jobContainer">
        <Sidebar />
				<JobFeed />
        <Rightbar/>
      </div>
    </>
	);
}

export default Job;
