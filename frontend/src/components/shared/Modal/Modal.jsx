import './Modal.css';

const Modal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{message}</h3>
        <div className="modal-actions">
          <button className="modal-btn" onClick={onConfirm}>Yes</button>
          <button className="modal-btn" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
