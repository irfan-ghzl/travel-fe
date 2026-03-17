import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { toursApi } from '../api';
import type { TourPackage, TourSchedule, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [schedules, setSchedules] = useState<TourSchedule[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'facilities' | 'reviews'>('itinerary');

  useEffect(() => {
    if (!id) return;
    const tourId = Number(id);
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [tourData, schedulesData, reviewsData] = await Promise.all([
          toursApi.get(tourId),
          toursApi.getSchedules(tourId).catch(() => []),
          toursApi.getReviews(tourId).catch(() => []),
        ]);
        if (!cancelled) {
          setTour(tourData);
          setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    // Reset state when id changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTour(null);
    setSchedules([]);
    setReviews([]);
    setLoading(true);
    fetchData();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading tour details..." />;
  if (!tour) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Tour not found</h3>
          <Link to="/tours" className="btn btn-primary">Browse Tours</Link>
        </div>
      </div>
    );
  }

  const displayPrice = tour.discount_price ?? tour.price;
  const hasDiscount = tour.discount_price != null && tour.discount_price < tour.price;

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/bookings/create?tour_id=${tour.id}`);
  };

  return (
    <div className="tour-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/tours">Tours</Link>
          <ChevronRight size={14} />
          <span>{tour.title}</span>
        </div>
      </div>

      <div className="container">
        <div className="tour-detail-layout">
          {/* Main Content */}
          <div className="tour-detail-main">
            {/* Image */}
            <div className="tour-detail-image">
              <img
                src={tour.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop'}
                alt={tour.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop';
                }}
              />
              <span className="tour-detail-category">{tour.category}</span>
            </div>

            {/* Gallery */}
            {tour.gallery && tour.gallery.length > 0 && (
              <div className="tour-gallery">
                {tour.gallery.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="gallery-thumb">
                    <img
                      src={img}
                      alt={`${tour.title} ${idx + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="tour-detail-info">
              <h1>{tour.title}</h1>
              <div className="tour-detail-meta">
                {tour.destination && (
                  <span><MapPin size={16} /> {tour.destination.name}</span>
                )}
                <span><Clock size={16} /> {tour.duration_days} Days</span>
                <span><Users size={16} /> {tour.min_participants}–{tour.max_participants} People</span>
                <StarRating rating={tour.rating || 0} showValue totalReviews={tour.total_reviews} />
              </div>
              <div className="tour-detail-description">
                <p>{tour.description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="tour-tabs">
              <div className="tour-tabs-header">
                <button
                  className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('itinerary')}
                >
                  Itinerary
                </button>
                <button
                  className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
                  onClick={() => setActiveTab('facilities')}
                >
                  Facilities
                </button>
                <button
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              <div className="tour-tabs-content">
                {activeTab === 'itinerary' && (
                  <div className="itinerary-list">
                    {tour.itineraries && tour.itineraries.length > 0 ? (
                      tour.itineraries.map((item) => (
                        <div key={item.day} className="itinerary-item">
                          <div className="itinerary-day">Day {item.day}</div>
                          <div className="itinerary-content">
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No itinerary information available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'facilities' && (
                  <div className="facilities-grid">
                    {tour.facilities && tour.facilities.length > 0 ? (
                      tour.facilities.map((fac, idx) => (
                        <div key={idx} className="facility-item">
                          <CheckCircle size={20} className="facility-icon" />
                          <div>
                            <h4>{fac.name}</h4>
                            <p>{fac.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No facilities information available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="reviews-list">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="review-avatar">
                              {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="review-author">
                              <strong>{review.user?.name || 'Anonymous'}</strong>
                              <span>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <StarRating rating={review.rating} size={14} />
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="tour-detail-sidebar">
            <div className="booking-card">
              <div className="booking-card-price">
                {hasDiscount && (
                  <span className="price-original">Rp {tour.price.toLocaleString('id-ID')}</span>
                )}
                <span className="price-main">Rp {displayPrice.toLocaleString('id-ID')}</span>
                <span className="price-per">/person</span>
              </div>

              <div className="booking-card-info">
                <div className="booking-info-row">
                  <Clock size={16} />
                  <span>{tour.duration_days} Days</span>
                </div>
                <div className="booking-info-row">
                  <Users size={16} />
                  <span>Max {tour.max_participants} people</span>
                </div>
              </div>

              {/* Schedules */}
              {schedules.length > 0 && (
                <div className="booking-schedules">
                  <h4>Available Schedules</h4>
                  {schedules.slice(0, 5).map((schedule) => (
                    <div key={schedule.id} className="schedule-item">
                      <Calendar size={14} />
                      <div>
                        <span className="schedule-date">
                          {new Date(schedule.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' — '}
                          {new Date(schedule.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="schedule-slots">
                          {schedule.available_slots} slots left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn btn-primary btn-block btn-lg" onClick={handleBookNow}>
                Book Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
