import { useAuth } from "../hooks/UseAuth";
import AdminDashboard from "../admin/AdminDashboard";
import TeacherDashboard from "../teacher/TeacherDashboard";
import StudentDashBoard from "../student/StudentDashBoard";
import { use } from "react";

function Dashboard() {
  const { user } = useAuth();
  if(!user || !user.role) return <p>Loading...</p>
  
  const userId = user.id;
  console.log("User Id in dashboard ",userId);
  switch(user.role.toUpperCase()){
    case 'ADMIN':
        return <AdminDashboard/>
    case 'TEACHER':
        return <TeacherDashboard teacherId = {userId}/>
    case 'STUDENT':
        return <StudentDashBoard studentId = {userId}/>
    default:
        return <p>Unauthorized</p>
  }
}

export default Dashboard;