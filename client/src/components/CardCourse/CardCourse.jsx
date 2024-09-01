import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'; // Импортируем русскую локализацию
import './cardCourse.css'; // Стили для компонента курса

const CardCourse = ({ course }) => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	const formattedStartDate = format(new Date(course.startDate), 'd MMMM yyyy', {
		locale: ru,
	});
	const formattedEndDate = format(new Date(course.endDate), 'd MMMM yyyy', {
		locale: ru,
	});
	return (
		<div className='card'>
			<div className='cardWrapper'>
				<div className='cardCourseTop'>
					<img
						className='cardCourseImage'
						src={PF + course.image}
						alt={course.title}
					/>
					<h2 className='cardCourseTitle'>{course.title}</h2>
				</div>
				<div className='cardCourseCenter'>
					<p className='cardCourseDescription'>{course.description}</p>
					<p className='cardCoursePrice'>Цена: {course.price} руб.</p>
					<p className='cardCourseDates'>
						Дата начала: {formattedStartDate} <br />
						Дата окончания: {formattedEndDate}
					</p>
					<p className='cardCourseSchool'>Школа: {course.schoolName}</p>
				</div>
			</div>
		</div>
	);
};

export default CardCourse;
