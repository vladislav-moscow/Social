import { useEffect, useState } from 'react';
import CardJob from '../CardJob/CardJob';
import './jobFeed.css';
import axios from 'axios';

const JobFeed = () => {
	const [jobs, setJobs] = useState([]); // Хранение списка вакансий в состоянии
	const [loading, setLoading] = useState(true); // Состояние загрузки данных
	const [error, setError] = useState(null); // Состояние для обработки ошибок

	useEffect(() => {
		// Функция для получения всех вакансий
		const fetchJobs = async () => {
			try {
				const response = await axios.get('/api/jobs'); // Выполняем GET-запрос к API
				setJobs(response.data); // Обновляем состояние с полученными данными
			} catch (err) {
				setError(err.message); // Обрабатываем ошибки, если они возникают
			} finally {
				setLoading(false); // Завершаем процесс загрузки
			}
		};

		fetchJobs(); // Вызываем функцию для получения данных
	}, []); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании

	if (loading) return <p>Loading...</p>; // Показываем сообщение о загрузке
	if (error) return <p>Error: {error}</p>; // Показываем сообщение об ошибке
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
