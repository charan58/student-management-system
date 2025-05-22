import './AddTeacher.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/api';

function AddTeacher() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitTeacherForm = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/admin/register-teacher", data);
      toast.success(`Teacher created successfully with ID: ${response.data.teacherID}`);
      reset();
    } catch (error) {
      toast.error("Failed to register teacher");
      console.error("Error creating teacher:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='add-teacher-container'>
      <h2 className='form-title'>Register New Teacher</h2>

      <form onSubmit={handleSubmit(submitTeacherForm)} className='form-layout'>
        {/* Name */}
        <input
          type='text'
          placeholder='Teacher Name'
          {...register("name", { required: "*Teacher name is required" })}
        />
        {errors.name && <p className='error-message'>{errors.name.message}</p>}

        {/* Email */}
        <input
          type="email"
          placeholder="Teacher Email"
          {...register("email", {
            required: "*Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "*Invalid email format"
            }
          })}
        />

        {errors.email && <p className='error-message'>{errors.email.message}</p>}

        {/* Department */}
        <input
          type='text'
          placeholder='Department Name'
          {...register("department", { required: "*Department is required" })}
        />
        {errors.department && <p className='error-message'>{errors.department.message}</p>}

        {/* Submit */}
        <button type='submit' className='teacher-submit-btn' disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Register Teacher"}
        </button>
      </form>
    </div>
  );
}

export default AddTeacher;
