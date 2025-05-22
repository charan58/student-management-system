import { Outlet } from 'react-router-dom';
import AuthProvider from '../contexts/AuthProvider';
import Footer from '../footer/Footer';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {
  return (
    <AuthProvider>
      <div className="app">
        <ToastContainer/>
        <div className="page-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default MainLayout;
