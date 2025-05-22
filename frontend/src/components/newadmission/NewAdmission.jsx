import { useState } from "react";
import { useForm } from "react-hook-form"; 
import StudentImage from "../../assets/images/loginimage.jpg"; 
import './NewAdmission.css'; 
import { toast } from "react-toastify";

function NewAdmission() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [studentPhoto, setStudentPhoto] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentPhoto(URL.createObjectURL(file));
    }
  };

  // Submit handler
  const onSubmit = (data) => {
    // The form data is submitted to the admin he reviews the data and proceeds further
    const filteredData = {
      fullName: data.fullName,
      email: data.email,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      contactNumber: data.phoneNumber,
      parentName: data.parentName,
      isApproved: false // Or omit if the backend handles default
    };
    console.log(filteredData)

    axios.post("http://localhost:8080/api/create-request", filteredData)
      .then(response => {
        toast.success(response.data.message);
      })
      .catch(error => {
        toast.error(error);
      });

  };

  return (
    <div className="new-admission-container">
      {/* Background image */}
      <div className="background-image" style={{ backgroundImage: `url(${StudentImage})` }}></div>

      {/* Form content */}
      <div className="form-container">
        <div className="form-card">
          <h2 className="form-title">New Admission Form</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Student Personal Information */}
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  {...register("fullName", { required: "*full Name is required" })}
                />
                {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
              </div>

              <div className="form-group half-width">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  {...register("dateOfBirth", { required: "Date of Birth is required" })}
                />
                {errors.dob && <p className="error-message">{errors.dob.message}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  defaultValue=""
                  {...register("gender", {
                    required: "*gender is required",
                    validate: value => value !== "" || "Please select a gender"
                  })}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>

                {errors.gender && <p className="error-message">{errors.gender.message}</p>}
              </div>

              <div className="form-group half-width">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="123-456-7890"
                  {...register("phoneNumber", { required: "Phone Number is required" })}
                />
                {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}
              </div>
            </div>

            {/* Additional Fields */}
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  placeholder="123 Main St, City, Country"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && <p className="error-message">{errors.address.message}</p>}
              </div>

              <div className="form-group half-width">
                <label htmlFor="nationality">Nationality</label>
                <input
                  type="text"
                  id="nationality"
                  placeholder="Nationality"
                  {...register("nationality", { required: "Nationality is required" })}
                />
                {errors.nationality && <p className="error-message">{errors.nationality.message}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="emergencyContact">Emergency Contact</label>
                <input
                  type="tel"
                  id="emergencyContact"
                  placeholder="Emergency contact number"
                  {...register("emergencyContact", { required: "Emergency Contact is required" })}
                />
                {errors.emergencyContact && <p className="error-message">{errors.emergencyContact.message}</p>}
              </div>

              <div className="form-group half-width">
                <label htmlFor="admissionDate">Admission Date</label>
                <input
                  type="date"
                  id="admissionDate"
                  {...register("admissionDate", { required: "Admission Date is required" })}
                />
                {errors.admissionDate && <p className="error-message">{errors.admissionDate.message}</p>}
              </div>
            </div>

            {/* Student Photo */}
            <div className="form-group">
              <label htmlFor="studentPhoto">Upload Student Photo</label>
              <input
                type="file"
                id="studentPhoto"
                onChange={handleImageChange}
                accept="image/*"
              />
              {studentPhoto && (
                <div className="image-preview">
                  <img src={studentPhoto} alt="Student" />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="johndoe@example.com"
                  {...register("email", { required: "Email Address is required" })}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
              </div>

              <div className="form-group half-width">
                <label htmlFor="parentName">Parent/Guardian Name</label>
                <input
                  type="text"
                  id="parentName"
                  placeholder="Jane Doe"
                  {...register("parentName", { required: "Parent/Guardian Name is required" })}
                />
                {errors.parentName && <p className="error-message">{errors.parentName.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-btn">
              <button
                type="submit"
                className="submit-btn-primary"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewAdmission;
