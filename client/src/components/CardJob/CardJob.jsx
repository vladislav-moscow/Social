import './cardJob.css';
import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';

// Регистрируем русскую локализацию для timeago.js, чтобы отображать дату и время в русском формате.
register('ru', ru);

/**
 * Компонент для отображения карточки работы.
 * 
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.job - Объект, содержащий данные о работе.
 * @param {string} props.job.title - Заголовок работы.
 * @param {string} props.job.description - Описание работы.
 * @param {string} props.job.phoneNumber - Номер телефона для связи.
 * @param {string} props.job.salary - Зарплата за работу.
 * @param {string} props.job.image - Путь к изображению работы.
 * @param {string} props.job.createdAt - Дата создания поста в формате ISO.
 * 
 * @returns {JSX.Element} - Разметка карточки работы.
 */
const CardJob = ({ job }) => {
	// Определяем базовый путь для изображений, получаем его из переменной окружения
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	/**
	 * Форматируем дату создания поста с использованием timeago.js и русской локализации.
	 * @type {string}
	 */
	const formattedDate = format(job.createdAt, 'ru');

	return (
		<div className='card'>
			<div className='cardWrapper'>
				<div className='cardJobTop'>
					<img className='cardJobImage' src={PF + job.image} alt={job.title} />
					<h2 className='cardJobTitle'>{job.title}</h2>
				</div>
				<div className='cardJobCenter'>
					<p className='cardJobDescription'>{job.description}</p>
				</div>
				<div className='cardJobBottom'>
					<div className='cardJobPhone'>
						Телефон: <span>{job.phoneNumber}</span>
					</div>
					<div className='cardJobSalary'>
						Оклад: <span>{job.salary} руб.</span>
					</div>
				</div>
			</div>
			<div className='cardJobDate'>{formattedDate}</div>
		</div>
	);
};

export default CardJob;
