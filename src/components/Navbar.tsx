import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <Logo size={36} />
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/tours" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Tours
          </Link>

          {user ? (
            <div className="navbar-user-section">
              <Link to="/bookings" className="navbar-link" onClick={() => setMenuOpen(false)}>
                <BookOpen size={16} />
                My Bookings
              </Link>
              <div className="navbar-dropdown">
                <button
                  className="navbar-user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="navbar-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="navbar-username">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="navbar-dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <Link
                to="/login"
                className="btn btn-outline"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
