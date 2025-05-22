import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/header/Header";
import "./TeacherDashboard.css";
import axiosInstance from "../api/api";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/UseAuth";
import {
  FaUserGraduate,
  FaBook,
  FaPen,
  FaChartBar,
  FaCalendarCheck,
  FaTasks,
  FaEnvelope,
} from "react-icons/fa";

function TeacherDashboard({ teacherId }) {
  const navigate = useNavigate();
  const { user, loginStatus } = useAuth();

  const [stats, setStats] = useState({
    studentStat: 0,
    courseStat: 0,
  });

  useEffect(() => {
    const fetchTeacherStats = async () => {
      if (!user || !user.id) return;

      try {
        const [studentRes, courseRes] = await Promise.all([
          axiosInstance.get(`/teacher/students-count/${user.id}`),
          axiosInstance.get(`/teacher/courses-count/${user.id}`)
        ]);

        const studentCount = studentRes.data.payload?.[0]?.studentCount || 0;
        const courseCount = courseRes.data.payload?.[0]?.courseCount || 0;

        setStats({
          studentStat: studentCount,
          courseStat: courseCount
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        toast.error("Failed to load dashboard stats.");
      }
    };

    fetchTeacherStats();
  }, [loginStatus, user]);

  return (
    <>
      <Header />
      <div className="teacher-dashboard">
        <h2 className="dashboard-title">Teacher Dashboard</h2>

        <div className="dashboard-widgets">
          {/* My Students */}
          <div className="widget-card">
            <FaUserGraduate className="widget-icon" />
            <div>
              <h3>My Students</h3>
              <p>{stats.studentStat}</p>
              <button
                className="dashboard-btn"
                onClick={() => navigate("/teacher/my-students")}
              >
                View
              </button>
            </div>
          </div>

          {/* My Courses */}
          <div className="widget-card">
            <FaBook className="widget-icon" />
            <div>
              <h3>My Courses</h3>
              <p>{stats.courseStat}</p>
              <button
                className="dashboard-btn"
                onClick={() => navigate("/teacher/my-courses")}
              >
                View
              </button>
            </div>
          </div>

          {/* Add Grade */}
          <div className="widget-card">
            <FaPen className="widget-icon" />
            <div>
              <h3>Add Grade</h3>
              <button
                className="dashboard-btn"
                onClick={() => navigate("/teacher/add-grade")}
              >
                Grade Now
              </button>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="widget-card chart">
            <FaChartBar className="widget-icon" />
            <div>
              <h3>Performance Overview</h3>
              <p>Average grades by course</p>
              <button
                className="dashboard-btn"
                onClick={() => navigate("/teacher/performance")}
              >
                View Performance
              </button>
            </div>
          </div>

          {/* Attendance */}
          <div className="widget-card">
            <FaCalendarCheck className="widget-icon" />
            <div>
              <h3>Attendance</h3>
              <p>Track daily presence</p>
              <button
                className="dashboard-btn"
                onClick={() => navigate("/teacher/attendance")}
              >
                Mark Attendance
              </button>
            </div>
          </div>

          {/* Assignments */}
          <div className="widget-card">
            <FaTasks className="widget-icon" />
            <div>
              <h3>Assignments</h3>
              <p>Manage & review tasks</p>
              <button
                className="dashboard-btn"
                onClick={() => navigate("/teacher/assignments")}
              >
                Manage Assignments
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="widget-card">
            <FaEnvelope className="widget-icon" />
            <div>
              <h3>Messages</h3>
              <p>Communicate with students</p>
              <button
                className="dashboard-btn"
                onClick={() => navigate("/teacher/messages")}
              >
                Open Messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherDashboard;
