import './ViewTeacherStudents.css';
import { useAuth } from '../../hooks/UseAuth';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/api';
import { toast } from 'react-toastify';

function ViewTeacherStudents() {
  const { user, loginStatus } = useAuth();
  const [groupedStudents, setGroupedStudents] = useState({});

  useEffect(() => {
    const fetchStudents = () => {
      axiosInstance.get(`/teacher/${user.id}/enrollments`)
        .then((response) => {
          const students = response.data.payload;
          const grouped = students.reduce((acc, student) => {
            const course = student.courseName;
            if (!acc[course]) {
              acc[course] = [];
            }
            acc[course].push(student);
            return acc;
          }, {});
          setGroupedStudents(grouped);
        })
        .catch((error) => {
          console.error("Error fetching students ", error);
          toast.error("Error occurred while fetching students");
        });
    };

    if (user?.id) {
      fetchStudents();
    }
  }, [loginStatus, user]);

  return (
  <div className="view-teacher-students">
    <h1>My Students</h1>
    <div className="table-container">
      <table className="students-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Student ID</th>
            <th>Student Name</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedStudents).length > 0 ? (
            Object.entries(groupedStudents).map(([courseName, students]) =>
              students.map((student, index) => (
                <tr key={`${student.studentId}-${index}`}>
                  {index === 0 && (
                    <td
                      rowSpan={students.length}
                      title={courseName}
                      className="course-name-cell"
                    >
                      {courseName}
                    </td>
                  )}
                  <td>{student.studentId}</td>
                  <td>{student.studentName}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="3">No students enrolled.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}

export default ViewTeacherStudents;
