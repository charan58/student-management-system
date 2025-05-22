import { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import Header from "../shared/header/Header";
import SummaryModal from "../shared/summarymodal/SummaryModal";
import {
  FaUsers, FaBookOpen, FaChalkboardTeacher,
  FaInbox, FaPlus, FaChartPie,
} from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    requests: 0,
    courses: 0,
    teachers: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [gpaSummary, setGpaSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, studentReqs, coursesRes, teachersRes] = await Promise.all([
          axiosInstance.get("/admin/students/count"),
          axiosInstance.get("/admin/requests/count"),
          axiosInstance.get("/admin/courses/count"),
          axiosInstance.get("/admin/teachers/count"),
        ]);
        setStats({
          students: studentsRes.data,
          requests: studentReqs.data,
          courses: coursesRes.data,
          teachers: teachersRes.data,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleSummaryClick = async () => {
    try {
      const response = await axiosInstance.get("/admin/dashboard-summary");
      setGpaSummary(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="admin-dashboard">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        <div className="dashboard-widgets">
          <div className="widget-card"><FaUsers className="widget-icon" /><div><h3>Total Students</h3><p>{stats.students}</p></div></div>
          <div className="widget-card"><FaBookOpen className="widget-icon" /><div><h3>Total Courses</h3><p>{stats.courses}</p></div></div>
          <div className="widget-card"><FaChalkboardTeacher className="widget-icon" /><div><h3>Total Teachers</h3><p>{stats.teachers}</p></div></div>
          <div className="widget-card action"><FaInbox className="widget-icon" /><div><h3>New Student Requests</h3><p>{stats.requests}</p><button className="dashboard-btn" onClick={() => navigate("/admin/student-requests")}>View Requests</button></div></div>
          <div className="widget-card action"><PiStudentBold className="widget-icon" /><div><h3>My Students</h3><button className="dashboard-btn" onClick={() => navigate("/admin/students")}>View</button></div></div>
          <div className="widget-card action"><FaPlus className="widget-icon" /><div><h3>Add Course</h3><button className="dashboard-btn" onClick={() => navigate("/admin/add-course")}>Create</button></div></div>
          <div className="widget-card action"><FaChalkboardTeacher className="widget-icon" /><div><h3>Add Teacher</h3><button className="dashboard-btn" onClick={() => navigate("/admin/register-teacher")}>Add</button></div></div>
          <div className="widget-card chart"><FaChartPie className="widget-icon" /><div><h3>Summary Chart</h3><p>GPA & Grade Distribution</p><button className="dashboard-btn" onClick={handleSummaryClick}>View</button></div></div>
        </div>
      </div>

      {showModal && <SummaryModal onClose={() => setShowModal(false)} gpaSummary={gpaSummary} />}
    </>
  );
}

export default AdminDashboard;
