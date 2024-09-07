import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'; // Импортируем русскую локализацию
import './cardCourse.css'; // Стили для компонента курса

/**
 * Компонент для отображения карточки курса.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.course - Объект, содержащий данные о курсе.
 * @param {string} props.course.title - Заголовок курса.
 * @param {string} props.course.description - Описание курса.
 * @param {string} props.course.price - Цена курса.
 * @param {string} props.course.image - Путь к изображению курса.
 * @param {string} props.course.startDate - Дата начала курса в формате ISO.
 * @param {string} props.course.endDate - Дата окончания курса в формате ISO.
 * @param {string} props.course.schoolName - Название школы, предоставляющей курс.
 *
 * @returns {JSX.Element} - Разметка карточки курса.
 */
const CardCourse = ({ course }) => {
	// Определяем базовый путь для изображений, получаем его из переменной окружения
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	/**
	 * Форматируем дату начала курса.
	 * @type {string}
	 */
	const formattedStartDate = format(new Date(course.startDate), 'd MMMM yyyy', {
		locale
		: ru,
	});
	/**
	 * Форматируем дату окончания курса.
	 * @type {string}
	 */
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
