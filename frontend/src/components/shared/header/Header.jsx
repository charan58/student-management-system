import './Header.css'
import { useAuth } from '../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const capitalizeWords=(str)=>{
      return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <span className="welcome-msg">Welcome, {capitalizeWords(user.fullName)}</span>
        <h1 className='school-name-title'>Greenwood High School</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
