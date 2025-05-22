import './ViewTeacherCourses.css';
import { useAuth } from '../../hooks/UseAuth';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/api';
import { toast } from 'react-toastify';
function ViewTeacherCourses() {
    const { user, loginStatus } = useAuth();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchStudents = () => {
            axiosInstance.get(`/teacher/my-courses/${user.id}`)
                .then((response) => {
                    setCourses(response.data.payload);
                })
                .catch((error) => {
                    toast.error("Error fetching your students");
                })
        };

        if (user?.id) {
            fetchStudents();
        }
    }, [loginStatus, user])

    return (
        <div className='view-teacher-students'>
            <h1>My Courses</h1>

            <table>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Description</th>
                        <th>Credits</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        courses.length > 0 ? (
                            courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.name}</td>
                                    <td>{course.description}</td>
                                    <td>{course.credits}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No courses found.</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ViewTeacherCourses