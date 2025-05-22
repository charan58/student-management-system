import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import './AddCourse.css';
import axiosInstance from "../api/api";

function AddCourse() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-teacher-id-dept");
        setTeacherInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch teacher info:", error);
        toast.error("Failed to load teacher list.");
      }
    };
    fetchTeacherInfo();
  }, []);

  const submitCourseForm = (data) => {
    setIsSubmitting(true);

    axiosInstance.post("/admin/create-course", data)
      .then((res) => {
        toast.success(`Course created with ID: ${res.data.split(": ")[1]}`);
      })
      .catch(() => {
        toast.error("Failed to create course.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="add-course-container">
      <h2 className="form-title">Add New Course</h2>

      <form onSubmit={handleSubmit(submitCourseForm)} className="form-layout">

        {/* Course Name */}
        <input
          type="text"
          placeholder="Course Name"
          {...register("name", { required: "*Course name is required" })}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}

        {/* Course Description */}
        <textarea
          placeholder="Course Description"
          {...register("description", { required: "*Course description is required" })}
        />
        {errors.description && <p className="error-message">{errors.description.message}</p>}

        {/* Course Credits */}
        <input
          type="number"
          placeholder="Course Credits"
          {...register("credits", {
            required: "*Credits are required",
            min: { value: 1, message: "*Minimum 1 credit required" },
            max: { value: 4, message: "*Maximum 4 credits allowed" }
          })}
        />
        {errors.credits && <p className="error-message">{errors.credits.message}</p>}

        {/* Teacher Selection */}
        <select
          {...register("teacherId", { required: "*Please select a teacher" })}
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="" disabled>Select a Teacher</option>
          {Object.entries(teacherInfo).map(([id, dept]) => (
            <option key={id} value={id}>
              {`${id} - ${dept}`}
            </option>
          ))}
        </select>
        {errors.teacherId && <p className="error-message">{errors.teacherId.message}</p>}

        {/* Submit */}
        <button type="submit" className="course-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
