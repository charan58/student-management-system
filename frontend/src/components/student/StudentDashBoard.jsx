import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/header/Header";
import { useAuth } from "../hooks/UseAuth";
import axiosInstance from "../api/api";
import "./StudentDashboard.css";
import { FaUser, FaBook, FaClipboardList, FaChartLine, FaFileDownload } from "react-icons/fa";

function StudentDashboard(props) {
  const navigate = useNavigate();
  const { user, loginStatus } = useAuth();
  const studentId = user?.id;
  const [profile, setProfile] = useState({});
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [profileRes, coursesRes, gradesRes, gpaRes] = await Promise.all([
          axiosInstance.get(`/student/${studentId}/profile`),
          axiosInstance.get(`/student/${studentId}/courses`),
          axiosInstance.get(`/student/${studentId}/grades`),
          axiosInstance.get(`/student/${studentId}/gpa`),
        ]);


        setProfile(profileRes.data);
        setCourses(coursesRes.data.courses);
        setGrades(gradesRes.data.grades);
        setGpa(gpaRes.data.gpa);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [studentId, loginStatus]);

  return (
    <>
      <Header />
      <div className="student-dashboard">
        <h2 className="dashboard-title">Student Dashboard</h2>

        <div className="dashboard-widgets">
          {/* My Profile */}
          <div className="widget-card">
            <FaUser className="widget-icon" />
            <div>
              <h3>My Profile</h3>
              <p>Name: {profile.name}</p>
              <p>Email: {profile.email}</p>
              <p>Phone Number: {profile.phoneNumber}</p>
            </div>
          </div>

          {/* My Courses */}
          <div className="widget-card">
            <FaBook className="widget-icon" />
            <div>
              <h3>My Courses</h3>
              <ul className="course-list">
                {courses.map(course => (
                  <li key={course.id}>{course.name}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* My Grades */}
          <div className="widget-card">
            <FaClipboardList className="widget-icon" />
            <div>
              <h3>My Grades</h3>
              <ul className="grade-list">
                {grades.map((grade, index) => (
                  <li key={index}>
                    {grade.courseName}: {grade.grade}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* GPA Summary */}
          <div className="widget-card">
            <FaChartLine className="widget-icon" />
            <div>
              <h3>GPA Summary</h3>
              <p>Current CGPA: <strong>{gpa}</strong></p>
            </div>
          </div>

          {/* Report Download */}
          <div className="widget-card action">
            <FaFileDownload className="widget-icon" />
            <div>
              <h3>Download Report</h3>
              <button
                className="dashboard-btn"
                onClick={async () => {
                  try {
                    const response = await axiosInstance.get(`/student/${studentId}/report`, {
                      responseType: "blob", // Important: receive binary data
                    });

                    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "student_report.pdf");
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Error downloading PDF:", error);
                  }
                }}
              >
                Download PDF
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
