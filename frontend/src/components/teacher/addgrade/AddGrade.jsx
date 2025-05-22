import './AddGrade.css';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/UseAuth';
import axiosInstance from '../../api/api';

function AddGrade() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentCourseInfo, setStudentCourseInfo] = useState([]);
  const [studentId, setStudentId] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (studentId) {
      const fetchStudentCourses = async () => {
        try {
          const response = await axiosInstance.get(`/teacher/${studentId}/courses`);
          setStudentCourseInfo(response.data.courses || []);
        } catch (error) {
          console.error("Failed to load student courses:", error);
          toast.error("Failed to load student courses");
        }
      };

      fetchStudentCourses();
    }
  }, [studentId]);


  const handleAddGrade = (data) => {
    console.log("The form object ", data);
    setIsSubmitting(true);
    const payload = {
      courseId: parseInt(data.courseId),
      grade: data.grade
    };
    console.log("The Payload data in the add grade form:", payload);

    axiosInstance.put(`/teacher/grades/${data.studentId}`, payload)
      .then((res) => {
        toast.success(`Grade saved for Student ${res.data.studentId}`);
        reset();
      })
      .catch((error) => {
        toast.error("Failed to save grade");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="add-grade-form">
      <h2>Add / Modify Grade</h2>
      <form onSubmit={handleSubmit(handleAddGrade)}>

        {/* Student ID */}
        <div className="form-group">
          <label>Student ID</label>
          <input
            type="number"
            {...register("studentId", { required: "Student ID is required" })}
            onBlur={(e) => setStudentId(e.target.value)}
            className={errors.studentId ? "input-error" : ""}
          />
          {errors.studentId && <span className="error">{errors.studentId.message}</span>}
        </div>

        {/* Course Dropdown */}
        <div className="form-group">
          <label>Select Course</label>
          <select
            {...register("courseId", { required: "Course is required" })}
            className={errors.courseId ? "input-error" : ""}
          >
            <option value="">-- Select Course --</option>
            {studentCourseInfo.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {errors.courseId && <span className="error">{errors.courseId.message}</span>}
        </div>

        {/* Grade Dropdown */}
        <div className="form-group">
          <label>Grade</label>
          <select
            {...register("grade", { required: "Grade is required" })}
            className={errors.grade ? "input-error" : ""}
          >
            <option value="">-- Select Grade --</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="F">F</option>
          </select>
          {errors.grade && <span className="error">{errors.grade.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save Grade"}
        </button>
      </form>
    </div>
  );
}

export default AddGrade;
