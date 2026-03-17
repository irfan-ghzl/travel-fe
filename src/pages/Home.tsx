import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Shield,
  Headphones,
  CreditCard,
  Star,
  TrendingUp,
  Globe,
  Users,
} from 'lucide-react';
import { toursApi, destinationsApi } from '../api';
import type { TourPackage, Destination } from '../types';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredTours, setFeaturedTours] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      toursApi.list({ limit: 6 }).catch(() => ({ data: [], pagination: { page: 1, limit: 6, total: 0, total_pages: 0 } })),
      destinationsApi.list().catch(() => []),
    ]).then(([toursRes, dests]) => {
      setFeaturedTours(toursRes.data);
      setDestinations(Array.isArray(dests) ? dests : []);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Your Next <span className="text-accent">Adventure</span>
          </h1>
          <p className="hero-subtitle">
            Explore breathtaking destinations, create unforgettable memories, and travel with confidence.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-input">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search destinations, tours, experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Explore Now
            </button>
          </form>
          <div className="hero-stats">
            <div className="hero-stat">
              <Globe size={20} />
              <div>
                <strong>50+</strong>
                <span>Destinations</span>
              </div>
            </div>
            <div className="hero-stat">
              <TrendingUp size={20} />
              <div>
                <strong>200+</strong>
                <span>Tour Packages</span>
              </div>
            </div>
            <div className="hero-stat">
              <Users size={20} />
              <div>
                <strong>10K+</strong>
                <span>Happy Travelers</span>
              </div>
            </div>
            <div className="hero-stat">
              <Star size={20} />
              <div>
                <strong>4.8</strong>
                <span>Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      {destinations.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle">Explore the most visited destinations across the archipelago</p>
            </div>
            <div className="destinations-grid">
              {destinations.slice(0, 6).map((dest) => (
                <Link
                  key={dest.id}
                  to={`/tours?destination_id=${dest.id}`}
                  className="destination-card"
                >
                  <img
                    src={dest.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'}
                    alt={dest.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="destination-card-overlay">
                    <MapPin size={18} />
                    <h3>{dest.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Tours */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Tours</h2>
            <p className="section-subtitle">Handpicked tours for an unforgettable experience</p>
          </div>
          {loading ? (
            <LoadingSpinner message="Loading tours..." />
          ) : featuredTours.length > 0 ? (
            <>
              <div className="tours-grid">
                {featuredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              <div className="section-cta">
                <Link to="/tours" className="btn btn-primary btn-lg">
                  View All Tours
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No tours available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Pintour</h2>
            <p className="section-subtitle">We make your travel experience seamless and memorable</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Trusted & Secure</h3>
              <p>Licensed travel agency with secure payment processing and full insurance coverage.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard size={32} />
              </div>
              <h3>Best Price Guarantee</h3>
              <p>We offer competitive prices with no hidden fees. Find a lower price? We'll match it.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Headphones size={32} />
              </div>
              <h3>24/7 Support</h3>
              <p>Our dedicated support team is available around the clock to assist with any questions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>Curated Experiences</h3>
              <p>Each tour is handpicked and verified by our expert team for the best quality experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
