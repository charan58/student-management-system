import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorElement from './components/errorpage/ErrorElement';
import Home from './components/home/Home';
import NewAdmission from './components/newadmission/NewAdmission';
import MainLayout from './components/mainlayout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/routes/ProtectedRoute';
import Students from './components/student/students/Students';
import AddCourse from './components/course/AddCourse';
import AddTeacher from './components/teacher/addteacher/AddTeacher'
import NewStudentRequests from './components/student/newstudentreqs/NewStudentRequests';
import AddGrade from './components/teacher/addgrade/AddGrade';
import ViewTeacherStudents from './components/teacher/teacherstudents/ViewTeacherStudents';
import ViewTeacherCourses from './components/teacher/teachercourses/ViewTeacherCourses';
function App() {
  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <ErrorElement />,
      children: [
        { index: true, element: <Home /> },
        { path: 'new-enroll', element: <NewAdmission /> },
        { path: 'dashboard', 
          element: (
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          )
        },

        // Admin Routes
        {
          path: 'admin/students',
          element: (
            <ProtectedRoute>
              <Students/>
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/add-course',
          element: (
            <ProtectedRoute>
              <AddCourse/>
            </ProtectedRoute>
          )
        },
        {
          path:'admin/student-requests',
          element: (
            <ProtectedRoute>
              <NewStudentRequests/>
            </ProtectedRoute>
          )
        },
        {
          path:'admin/register-teacher',
          element: (
            <ProtectedRoute>
              <AddTeacher/>
            </ProtectedRoute>
          )
        },
        {
          path:'admin/add-course',
          element:(
            <ProtectedRoute>
              <AddCourse/>
            </ProtectedRoute>
          )
        },
        {
          path: 'teacher/add-grade',
          element: (
            <ProtectedRoute>
              <AddGrade/>
            </ProtectedRoute>
          )
        },
        {
          path: 'teacher/my-students',
          element:(
            <ProtectedRoute>
              <ViewTeacherStudents/>
            </ProtectedRoute>
          )
        },
        {
          path: 'teacher/my-courses',
          element: (
            <ProtectedRoute>
              <ViewTeacherCourses/>
            </ProtectedRoute>
          )
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={browserRouter} />
  );
}

export default App;
