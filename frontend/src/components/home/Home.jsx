import { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentImage from '../../assets/images/students.jpg';
import Login from '../login/Login';

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="relative h-screen w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${StudentImage})`,
        }}
      ></div>

      {/* Foreground content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] tracking-wide">
            Greenwood High Student Portal
          </h1>
          <p className="text-xl md:text-2xl font-body font-normal mb-8 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Your all-in-one hub for academic success. Access grades, manage courses,
            view student profiles, and stay on top of your progress — all in one place.
          </p>

          <div className="absolute top-6 right-6 flex gap-4">
            <Link to="/new-enroll" className="hover:underline hover:scale-105 px-6 py-2 rounded-lg text-lg font-bold transition duration-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              New Admission
            </Link>
            <button
              onClick={() => setShowLoginModal(true)}
              className="hover:underline hover:scale-105 px-6 py-2 rounded-lg text-lg font-bold transition duration-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

export default Home;
