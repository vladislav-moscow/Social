import CourseFeed from "../../components/CourseFeed/CourseFeed";
import Rightbar from "../../components/Rightbar/Rightbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./course.css";

/**
 * Компонент `Course` представляет собой страницу курса, включающую несколько панелей.
 * @returns {JSX.Element} Компонент страницы курса.
 */

const Course = () => {
	return (
		<>
      <Topbar />
      <div className="courseContainer">
        <Sidebar />
				<CourseFeed />
        <Rightbar/>
      </div>
    </>
	);
}

export default Course;
