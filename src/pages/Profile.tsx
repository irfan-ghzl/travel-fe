import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Camera, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (authLoading) return <LoadingSpinner message="Loading profile..." />;

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const updated = await authApi.updateProfile({ name, phone, avatar_url: avatarUrl });
      updateUser(updated);
      setMessage('Profile updated successfully!');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="profile-card">
          <div className="profile-header-section">
            <div className="profile-avatar-large">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} />
              ) : (
                <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <h1>{user.name}</h1>
            <p className="text-muted">{user.email}</p>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                <User size={16} /> Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email-display">
                <Mail size={16} /> Email
              </label>
              <input id="email-display" type="email" value={user.email} disabled />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={16} /> Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar">
                <Camera size={16} /> Avatar URL
              </label>
              <input
                id="avatar"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
