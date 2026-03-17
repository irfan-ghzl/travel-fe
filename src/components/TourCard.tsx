import { Link } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';
import StarRating from './StarRating';
import type { TourPackage } from '../types';

interface TourCardProps {
  tour: TourPackage;
}

export default function TourCard({ tour }: TourCardProps) {
  const displayPrice = tour.discount_price ?? tour.price;
  const hasDiscount = tour.discount_price != null && tour.discount_price < tour.price;

  return (
    <Link to={`/tours/${tour.id}`} className="tour-card">
      <div className="tour-card-image">
        <img
          src={tour.image_url || '/placeholder-tour.jpg'}
          alt={tour.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
          }}
        />
        <span className="tour-card-category">{tour.category}</span>
        {hasDiscount && <span className="tour-card-discount">Sale</span>}
      </div>
      <div className="tour-card-content">
        <h3 className="tour-card-title">{tour.title}</h3>
        <div className="tour-card-meta">
          {tour.destination && (
            <span className="tour-card-meta-item">
              <MapPin size={14} />
              {tour.destination.name}
            </span>
          )}
          <span className="tour-card-meta-item">
            <Clock size={14} />
            {tour.duration_days} days
          </span>
          <span className="tour-card-meta-item">
            <Users size={14} />
            Max {tour.max_participants}
          </span>
        </div>
        <div className="tour-card-footer">
          <div className="tour-card-price">
            {hasDiscount && (
              <span className="price-original">
                Rp {tour.price.toLocaleString('id-ID')}
              </span>
            )}
            <span className="price-current">
              Rp {displayPrice.toLocaleString('id-ID')}
            </span>
            <span className="price-per">/person</span>
          </div>
          <StarRating rating={tour.rating || 0} size={14} showValue totalReviews={tour.total_reviews} />
        </div>
      </div>
    </Link>
  );
}
