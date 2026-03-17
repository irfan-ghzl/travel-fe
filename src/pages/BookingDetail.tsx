import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  ArrowLeft,
  XCircle,
  Star,
} from 'lucide-react';
import { bookingsApi, paymentsApi, reviewsApi } from '../api';
import type { Booking, Payment } from '../types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  paid: 'badge-success',
  cancelled: 'badge-danger',
  completed: 'badge-success',
};

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user && id) {
      const bookingId = Number(id);
      Promise.all([
        bookingsApi.get(bookingId),
        paymentsApi.get(bookingId).catch(() => null),
      ]).then(([bookingData, paymentData]) => {
        setBooking(bookingData);
        setPayment(paymentData);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, user, authLoading, navigate]);

  const handleCancel = async () => {
    if (!booking || !confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    setError('');
    try {
      const updated = await bookingsApi.cancel(booking.id);
      setBooking(updated);
      setMessage('Booking cancelled successfully.');
    } catch {
      setError('Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;
    setProcessingPayment(true);
    setError('');
    try {
      const paymentRes = await paymentsApi.create({
        booking_id: booking.id,
        payment_method: paymentMethod,
      });
      setPayment(paymentRes);
      if (paymentRes.payment_url) {
        window.open(paymentRes.payment_url, '_blank');
      }
      setMessage('Payment initiated successfully!');
    } catch {
      setError('Failed to process payment.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setSubmittingReview(true);
    setError('');
    try {
      await reviewsApi.create({
        tour_package_id: booking.tour_package_id,
        booking_id: booking.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setMessage('Review submitted! Thank you for your feedback.');
      setShowReview(false);
    } catch {
      setError('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner message="Loading booking..." />;
  if (!booking) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Booking not found</h3>
          <Link to="/bookings" className="btn btn-primary">Back to Bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-detail-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/bookings')}>
          <ArrowLeft size={18} />
          Back to Bookings
        </button>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="booking-detail-layout">
          {/* Main Info */}
          <div className="booking-detail-main">
            <div className="card">
              <div className="card-header">
                <h2>Booking #{booking.id}</h2>
                <span className={`badge ${STATUS_COLORS[booking.status] || 'badge-default'}`}>
                  {booking.status}
                </span>
              </div>

              {booking.tour_package && (
                <div className="booking-tour-info">
                  <img
                    src={booking.tour_package.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'}
                    alt={booking.tour_package.title}
                    className="booking-tour-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop';
                    }}
                  />
                  <h3>
                    <Link to={`/tours/${booking.tour_package.id}`}>
                      {booking.tour_package.title}
                    </Link>
                  </h3>
                </div>
              )}

              <div className="booking-detail-grid">
                <div className="detail-item">
                  <Calendar size={18} />
                  <div>
                    <label>Travel Date</label>
                    <span>
                      {new Date(booking.travel_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Users size={18} />
                  <div>
                    <label>Participants</label>
                    <span>{booking.num_participants} people</span>
                  </div>
                </div>
                {booking.tour_package?.destination && (
                  <div className="detail-item">
                    <MapPin size={18} />
                    <div>
                      <label>Destination</label>
                      <span>{booking.tour_package.destination.name}</span>
                    </div>
                  </div>
                )}
                <div className="detail-item">
                  <CreditCard size={18} />
                  <div>
                    <label>Total Price</label>
                    <span className="price-main">Rp {booking.total_price?.toLocaleString('id-ID') || '0'}</span>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="booking-notes">
                  <h4>Notes</h4>
                  <p>{booking.notes}</p>
                </div>
              )}

              {/* Participants */}
              {booking.participants && booking.participants.length > 0 && (
                <div className="booking-participants">
                  <h4>Participants</h4>
                  <div className="participants-table">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>ID Card Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking.participants.map((p, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{p.name}</td>
                            <td>{p.id_card_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Actions */}
          <aside className="booking-detail-sidebar">
            {/* Payment Section */}
            {booking.status === 'pending' && !payment && (
              <div className="card">
                <h3>Make Payment</h3>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="e_wallet">E-Wallet</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={handlePayment}
                  disabled={processingPayment}
                >
                  <CreditCard size={16} />
                  {processingPayment ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            )}

            {/* Payment Info */}
            {payment && (
              <div className="card">
                <h3>Payment Info</h3>
                <div className="payment-info">
                  <div className="payment-row">
                    <span>Method</span>
                    <strong>{payment.payment_method}</strong>
                  </div>
                  <div className="payment-row">
                    <span>Amount</span>
                    <strong>Rp {payment.amount?.toLocaleString('id-ID') || '0'}</strong>
                  </div>
                  <div className="payment-row">
                    <span>Status</span>
                    <span className={`badge ${STATUS_COLORS[payment.status] || 'badge-default'}`}>
                      {payment.status}
                    </span>
                  </div>
                  {payment.paid_at && (
                    <div className="payment-row">
                      <span>Paid At</span>
                      <span>{new Date(payment.paid_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancel */}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                className="btn btn-outline-danger btn-block"
                onClick={handleCancel}
                disabled={cancelling}
              >
                <XCircle size={16} />
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}

            {/* Review */}
            {booking.status === 'completed' && (
              <div className="card">
                {!showReview ? (
                  <button
                    className="btn btn-outline btn-block"
                    onClick={() => setShowReview(true)}
                  >
                    <Star size={16} />
                    Write a Review
                  </button>
                ) : (
                  <form onSubmit={handleReview}>
                    <h3>Write a Review</h3>
                    <div className="form-group">
                      <label>Rating</label>
                      <div className="review-rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= reviewRating ? 'active' : ''}`}
                            onClick={() => setReviewRating(star)}
                          >
                            <Star size={24} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Comment</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        placeholder="Share your experience..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
