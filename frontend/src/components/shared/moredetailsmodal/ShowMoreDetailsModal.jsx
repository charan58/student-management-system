import './ShowMoreDetailsModal.css';

const ShowMoreDetailsModal = ({ show, onClose, student }) => {
  if (!show || !student) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Student Details</h3>
        <div className="student-details">
          <p><strong>Full Name:</strong> {student.fullName}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
          <p><strong>Contact Number:</strong> {student.contactNumber || 'N/A'}</p>
          <p><strong>Parent Name:</strong> {student.parentName || 'N/A'}</p>
          <p><strong>Approved:</strong> {student.approved ? 'Yes' : 'No'}</p>
        </div>
        <div className="modal-actions">
          <button className="modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ShowMoreDetailsModal;
