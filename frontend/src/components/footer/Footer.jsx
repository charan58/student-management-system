import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/new-enroll" className="footer-link">New Admission</Link></li>
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Success Stories</h3>
          <p>Read how our students have achieved success through our portal. Real stories of academic excellence and achievements.</p>
          <Link to="/success-stories" className="footer-link">Read Success Stories</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-links">
            <li>Email: support@greenwoodhigh.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Address: 1234 Education Blvd, City, Country</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Greenwood High School. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
