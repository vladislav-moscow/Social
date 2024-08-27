import "./confirmationModal.css";

const ConfirmationModal = ({ message, onConfirm, onClose }) => {
  return (
    <div className='confirmationModalOverlay' onClick={onClose}>
      <div className='confirmationModalContent' onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onConfirm}>Да</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
