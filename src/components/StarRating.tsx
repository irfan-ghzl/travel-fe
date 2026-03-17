import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  totalReviews?: number;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  showValue = false,
  totalReviews,
}: StarRatingProps) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} size={size} className="star-filled" />);
    } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
      stars.push(<StarHalf key={i} size={size} className="star-filled" />);
    } else {
      stars.push(<Star key={i} size={size} className="star-empty" />);
    }
  }

  return (
    <div className="star-rating">
      <div className="stars">{stars}</div>
      {showValue && <span className="rating-value">{rating.toFixed(1)}</span>}
      {totalReviews !== undefined && (
        <span className="rating-count">({totalReviews} reviews)</span>
      )}
    </div>
  );
}
