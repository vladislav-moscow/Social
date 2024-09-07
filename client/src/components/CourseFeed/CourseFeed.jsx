import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Stack,Skeleton} from '@mui/material';
import CardCourse from '../CardCourse/CardCourse';
import './courseFeed.css';

/**
 * Компонент `CourseFeed` отображает список курсов, загруженных с сервера.
 *
 * @returns {JSX.Element} Компонент, отображающий ленту курсов.
 */
const CourseFeed = () => {
	// Состояние для хранения списка курсов
	const [courses, setCourses] = useState([]);
	// Состояние для отслеживания состояния загрузки данных
	const [loading, setLoading] = useState(true);

	/**
	 * useEffect для загрузки списка курсов при монтировании компонента.
	 */
	useEffect(() => {
		// Асинхронная функция для выполнения HTTP-запроса и загрузки данных курсов
		const fetchCourses = async () => {
			try {
				// Выполняем GET-запрос для получения списка курсов
				const response = await axios.get('/api/course');
				// Устанавливаем полученные данные в состояние
				setCourses(response.data);
			} catch (err) {
				// В случае ошибки устанавливаем сообщение об ошибке в состояние
				console.error(err.message);
			} finally {
				// Завершаем состояние загрузки независимо от результата запроса
				setLoading(false);
			}
		};
		// Вызываем функцию для загрузки курсов
		fetchCourses();
	}, []);

	// Если данные еще загружаются, отображаем скелетоны
	if (loading) {
		return (
				<div className='courseFeed'>
						<div className='courseFeedWrapper'>
								<Stack spacing={2}>
										{[...Array(3)].map((_, index) => (
												<Skeleton
														key={index}
														variant="rectangular"
														width="100%"
														height={200}
														sx={{ borderRadius: 2 }}
												/>
										))}
								</Stack>
						</div>
				</div>
		);
}
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
