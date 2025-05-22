import './NewStudentRequests.css';
import Modal from '../../shared/Modal/Modal';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/api';
import { toast } from "react-toastify";
import ShowMoreDetailsModal from '../../shared/moredetailsmodal/ShowMoreDetailsModal';

function NewStudentRequests() {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [studentToAction, setStudentToAction] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        fetchStudentRequests();
    }, []);

    const fetchStudentRequests = () => {
        axiosInstance.get("/admin/students/pending")
            .then(response => setRequests(response.data))
            .catch(() => toast.error("Error fetching student requests"))
            .finally(() => setLoading(false));
    };

    const handleApprove = (id, name) => {
        setCurrentAction("approve");
        setStudentToAction({ id, name });
        setModalVisible(true);
    };

    const handleReject = (id, name) => {
        setCurrentAction("reject");
        setStudentToAction({ id, name });
        setModalVisible(true);
    };

    const confirmAction = () => {
        const { id, name } = studentToAction;

        if (currentAction === "approve") {
            axiosInstance.put(`/admin/approve-student/${id}`)
                .then(() => {
                    toast.success(`${name} was approved`);
                    setRequests(prev => prev.filter(s => s.id !== id));
                })
                .catch(() => toast.error(`Failed to approve ${name}`));
        } else {
            axiosInstance.delete(`/admin/reject-student/${id}`)
                .then((response) => {
                    toast.info(`${response.data.name} was rejected!`);
                    setRequests(prev => prev.filter(s => s.id !== id));
                })
                .catch(() => toast.error(`Failed to reject ${name}`));
        }

        setModalVisible(false);
    };

    const filteredReqs = requests.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredReqs.length / itemsPerPage);
    const paginated = filteredReqs.slice((currentPage - 1) * itemsPerPage, currentPage*itemsPerPage);

    const changePage=(newPage)=>{
        if(newPage<1 || newPage>totalPages) return;
        setCurrentPage(newPage);
    }
    return (
        <div className='admin-container'>
            <h2 className="admin-title">New Student Requests</h2>

            <input
                type="text"
                placeholder='Search by name...'
                className='admin-input'
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1)}}
            />

            {loading ? (
                <div className="spinner"></div>
            ) : filteredReqs.length === 0 ? (
                <p className="no-results">No results found</p>
            ) : (
                <>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>More Details</th>
                            <th>Actions</th>
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
          className="btn-approve"
          onClick={() => handleApprove(student.id, student.fullName)}
        >
          Approve
        </button>
        <button
          className="btn-reject"
          onClick={() => handleReject(student.id, student.fullName)}
        >
          Reject
        </button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
                {/* Pagination */}
                <div className='pagination-controls'>
                    <button onClick={()=>changePage(currentPage-1)} disabled={currentPage===1} className="pagination-btn">
                        &laquo; Prev
                    </button>
                    <span> Page {currentPage} of {totalPages}</span>
                    <button onClick={()=> changePage(currentPage+1)} disabled={currentPage===totalPages}className="pagination-btn">
                        Next &raquo;
                    </button>
                </div>
            </>

            )}

            <Modal
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={confirmAction}
                message={`Are you sure you want to ${currentAction} ${studentToAction?.name}?`}
            />

            <ShowMoreDetailsModal
                show={detailsModalVisible}
                onClose={() => setDetailsModalVisible(false)}
                student={selectedStudent}
            />
        </div>
    );
}

export default NewStudentRequests;
