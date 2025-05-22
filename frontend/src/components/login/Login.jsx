import './Login.css';
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login({ onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const { login, loginStatus} = useContext(AuthContext);

  const onSubmit = (data) => {
    login(data, ()=> navigate('/dashboard'));
    console.log("Login form data", data);
  };


  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  return (
    <div className="login-overlay">

      <div className="login-container fade-in">
        <button onClick={onClose} className="close-button">&times;</button>

        <div className="login-form-section">
          <h2 className="login-title">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <input
              className="login-input"
              type="text"
              placeholder="ID"
              {...register("id", { required: true })}
            />
            {errors.id && <span className="error-text">ID is required</span>}

            <div className="password-wrapper">
              <input
                className="login-input"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                className="eye-button"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="error-text">Password is required</span>}

            <button type="submit" className="login-button">Login</button>
          </form>

          <div className="forgot-password">
            <a href="#">Forgot your password?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
