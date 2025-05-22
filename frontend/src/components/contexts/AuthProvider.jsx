import {useState, useEffect} from 'react'
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [loginStatus,setLoginStatus] = useState(false);
  const [error,setError] = useState("");

  useEffect(()=>{
    const storedUser = localStorage.getItem('user');
    if(storedUser) {
      setUser(JSON.parse(storedUser));
      setLoginStatus(true);
    };
  },[]);

  const login = (userData, onSuccess)=>{
    axios.post("http://localhost:8080/auth/login", userData)
    .then(response=>{
      const { token, loggedUserDetails, message} = response.data;
      setUser({...loggedUserDetails});
      setCurrentUser({...loggedUserDetails});
      setLoginStatus(true);
      setError("");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedUserDetails));

      toast.success("Login Successful!", { position: "top-right"});

      if (onSuccess) onSuccess(); 
    })
    .catch(error=>{
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right"})
    })
  }

  const logout = ()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setLoginStatus(false);
    setCurrentUser({});
    toast.info("Logged out ", { position: "top-right"});
  }

  return (
    <AuthContext.Provider value={{ user, currentUser, login, logout, error, loginStatus}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider