import './confirmationModal.css';

/**
 * Компонент `ConfirmationModal` отображает модальное окно с сообщением и кнопками для подтверждения или отмены действия.
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} props.message - Сообщение, которое будет отображаться в модальном окне.
 * @param {Function} props.onConfirm - Функция, которая вызывается при подтверждении действия.
 * @param {Function} props.onClose - Функция, которая вызывается при закрытии модального окна.
 *
 * @returns {JSX.Element} Компонент, отображающий модальное окно подтверждения.
 */

const ConfirmationModal = ({ message, onConfirm, onClose }) => {
	return (
		<div className='confirmationModalOverlay' onClick={onClose}>
			<div
				className='confirmationModalContent'
				onClick={(e) => e.stopPropagation()}
			>
				<p>{message}</p>
				<button onClick={onConfirm}>Да</button>
				<button onClick={onClose}>Отмена</button>
			</div>
		</div>
	);
};

export default ConfirmationModal;
