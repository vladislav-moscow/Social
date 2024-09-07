import { useEffect, useState } from 'react';
import CardJob from '../CardJob/CardJob';
import {Stack,Skeleton} from '@mui/material';
import axios from 'axios';
import './jobFeed.css';

/**
 * Компонент `JobFeed` отображает список вакансий.
 *
 * @returns {JSX.Element} Компонент, отображающий вакансии или сообщения о загрузке/ошибке.
 */

const JobFeed = () => {
	const [jobs, setJobs] = useState([]); // Хранение списка вакансий в состоянии
	const [loading, setLoading] = useState(true); // Состояние загрузки данных

	/**
	 * useEffect для загрузки данных вакансий при монтировании компонента.
	 */
	useEffect(() => {
		// Функция для получения всех вакансий
		const fetchJobs = async () => {
			try {
				// Выполняем GET-запрос к API для получения списка вакансий
				const response = await axios.get('/api/jobs');
				// Обновляем состояние с полученными данными вакансий
				setJobs(response.data);
			} catch (err) {
				// Обрабатываем ошибки, если они возникают при выполнении запроса
				console.error(err.message);
			} finally {
				// Завершаем процесс загрузки, независимо от результата запроса
				setLoading(false);
			}
		};
		// Вызываем функцию для получения данных вакансий
		fetchJobs();
	}, []); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании компонента

	// Показываем скелетоны, пока данные не загружены
	if (loading) {
		return (
				<div className='cardJob'>
						<div className='cardJobWrapper'>
								<Stack spacing={2}>
										{[...Array(3)].map((_, index) => (
												<Skeleton
														key={index}
														variant="rectangular"
														width="100%"
														height={400}
														sx={{ borderRadius: 2 }}
												/>
										))}
								</Stack>
						</div>
				</div>
		);
}
	return (
		<div className='cardJob'>
			<div className='cardJobWrapper'>
				{jobs.map((job) => (
					<div key={job._id}>
						<CardJob job={job} />
					</div>
				))}
			</div>
		</div>
	);
};

export default JobFeed;
