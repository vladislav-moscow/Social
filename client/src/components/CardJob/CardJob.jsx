import './cardJob.css';
import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';

// Регистрируем русскую локализацию для timeago.js, чтобы отображать дату и время в русском формате.
register('ru', ru);

const CardJob = ({ job }) => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	// Форматируем дату создания поста с использованием timeago.js и русской локализации.
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
