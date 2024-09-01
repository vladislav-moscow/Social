import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardCourse from '../CardCourse/CardCourse';
import './courseFeed.css'; // Добавьте стили для ленты курсов

const CourseFeed = () => {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get('/api/course');
				setCourses(response.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className='courseFeed'>
			<div className='courseFeedWrapper'>
				{courses.map((course) => (
					<CardCourse key={course._id} course={course} />
				))}
			</div>
		</div>
	);
};

export default CourseFeed;
