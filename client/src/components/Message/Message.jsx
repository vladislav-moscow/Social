import { format, register } from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';
import "./message.css";

// Регистрируем русскую локализацию для timeago.js, чтобы отображать дату и время в русском формате.
register('ru', ru);

const Message = ({ message, own}) => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	// Форматируем дату создания поста с использованием timeago.js и русской локализации.
	const formattedDate = format(message.createdAt, 'ru');

	return (
		<div className={own? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={PF + 'person/1.jpg'}
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{formattedDate}</div>
    </div>
  );
}

export default Message;
