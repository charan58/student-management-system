import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ShowMoreDetailsModal from "../../shared/moredetailsmodal/ShowMoreDetailsModal";
import Modal from "../../shared/Modal/Modal";
import './Students.css';
import axiosInstance from "../../api/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const confirmDelete = () => {
    const { id, fullName } = studentToDelete;

    axiosInstance.delete(`/admin/remove-student/${id}`)
      .then(() => {
        toast.success(`${fullName} was removed`);
        setStudents(prev => prev.filter(s => s.id !== id));
      })
      .catch(() => toast.error(`Failed to remove ${fullName}`))
      .finally(() => setDeleteModalVisible(false));
  };



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axiosInstance.get("/admin/students")
      .then(res => setStudents(res.data))
      .catch(() => toast.error("Error fetching students"))
      .finally(() => setLoading(false));
  };

  const filtered = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">The Students</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="admin-input"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset to page 1 on search
        }}
      />

      {loading ? (
        <div className="spinner"></div>
      ) : filtered.length === 0 ? (
        <p className="no-results">No results found</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>More Details</th>
                <th>Left School?</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      className="btn-more-details"
                      onClick={() => {
                        setSelectedStudent(student);
                        setDetailsModalVisible(true);
                      }}
                    >
                      show
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => {
                        setStudentToDelete(student);
                        setDeleteModalVisible(true);
                      }}
                    >
                      Yes
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
              &laquo; Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
              Next &raquo;
            </button>
          </div>
        </>
      )}

      <ShowMoreDetailsModal
        show={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        student={selectedStudent}
      />

      <Modal
        show={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${studentToDelete?.fullName}?`}
      />

    </div>
  );
}

export default Students;
