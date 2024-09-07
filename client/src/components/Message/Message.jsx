import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';
import useUserStore from '../../store/useUserStore';
import './message.css';

// Регистрируем русскую локализацию для timeago.js, чтобы отображать дату и время в русском формате.
register('ru', ru);

/**
 * Компонент `Message` отображает сообщение в чате.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.message - Объект сообщения, который нужно отобразить.
 * @param {boolean} props.own - Флаг, указывающий, принадлежит ли сообщение текущему пользователю.
 * @param {Object} props.currentUser - Данные текущего пользователя.
 *
 * @returns {JSX.Element} Компонент, отображающий сообщение с возможными вложениями.
 */

const Message = ({ message, own, currentUser}) => {
	// Путь к публичной папке для загрузки изображений
	const PF = import.meta.env.VITE_PUBLIC_FOLDER; 
	// Используем Zustand store для получения и загрузки данных пользователя
	const { getUserById } = useUserStore((state) => ({
		getUserById: state.getUserById,
	}));
	// Получаем ID отправителя сообщения
	const senderId = message.sender;
	// Получаем данные пользователя по ID отправителя
	const sender = getUserById(senderId);
	// Форматируем дату создания сообщения с использованием timeago.js и русской локализации
	const formattedDate = format(message.createdAt, 'ru');

	return (
		<div className={own ? 'message own' : 'message'}>
			<div className='messageTop'>
				{own ? <img
					className='messageImg'
					src={currentUser?.profilePicture ? PF + currentUser?.profilePicture : PF + 'person/noAvatar.png'}
					alt={currentUser.username}
				/>:<img
					className='messageImg'
					src={sender?.profilePicture ? PF + sender?.profilePicture : PF + 'person/noAvatar.png'}
					alt={sender.username}
				/>}
				
				<div className='messageContent'>
					{message.img ? (
						<div className='messageText textImg'>
							<img
								className='messageImgContent'
								src={PF + message.img}
								alt='Message attachment'
							/>
							{message.text && (
								<span className='messageTextInImg'>{message.text}</span>
							)}
						</div>
					) : (
						<div className='messageText'>{message.text}</div>
					)}
				</div>
			</div>
			<div className='messageBottom'>{formattedDate}</div>
		</div>
	);
};

export default Message;
