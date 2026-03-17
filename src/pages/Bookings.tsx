import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, CreditCard } from 'lucide-react';
import { bookingsApi } from '../api';
import type { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  paid: 'badge-success',
  cancelled: 'badge-danger',
  completed: 'badge-success',
};

export default function Bookings() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      bookingsApi
        .list()
        .then((data) => setBookings(Array.isArray(data) ? data : []))
        .catch(() => setBookings([]))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) return <LoadingSpinner message="Loading bookings..." />;

  return (
    <div className="bookings-page">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your travel bookings</p>
        </div>

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/bookings/${booking.id}`}
                className="booking-card"
              >
                <div className="booking-card-image">
                  <img
                    src={
                      booking.tour_package?.image_url ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=150&fit=crop'
                    }
                    alt={booking.tour_package?.title || 'Tour'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=150&fit=crop';
                    }}
                  />
                </div>
                <div className="booking-card-content">
                  <div className="booking-card-header">
                    <h3>{booking.tour_package?.title || `Booking #${booking.id}`}</h3>
                    <span className={`badge ${STATUS_COLORS[booking.status] || 'badge-default'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-card-meta">
                    <span>
                      <Calendar size={14} />
                      {new Date(booking.travel_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    {booking.tour_package?.destination && (
                      <span>
                        <MapPin size={14} />
                        {booking.tour_package.destination.name}
                      </span>
                    )}
                    <span>
                      <Users size={14} />
                      {booking.num_participants} participants
                    </span>
                    <span>
                      <CreditCard size={14} />
                      Rp {booking.total_price?.toLocaleString('id-ID') || '0'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>Start exploring tours and book your first adventure!</p>
            <Link to="/tours" className="btn btn-primary">
              Browse Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
