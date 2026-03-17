import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo size={36} />
            <p className="footer-desc">
              Discover amazing destinations and unforgettable travel experiences with Pintour.
              Your trusted travel companion for adventures across Indonesia and beyond.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/tours">Tours</Link>
            <Link to="/bookings">My Bookings</Link>
            <Link to="/profile">Profile</Link>
          </div>

          <div className="footer-links-group">
            <h4>Categories</h4>
            <Link to="/tours?category=adventure">Adventure</Link>
            <Link to="/tours?category=cultural">Cultural</Link>
            <Link to="/tours?category=beach">Beach</Link>
            <Link to="/tours?category=nature">Nature</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>Jakarta, Indonesia</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>hello@pintour.com</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Pintour. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
