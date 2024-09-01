import "./job.css";
import Topbar from '../../components/Topbar/Topbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Rightbar from '../../components/Rightbar/Rightbar';
import JobFeed from "../../components/JobFeed/JobFeed";

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
