import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export default function LoadingSpinner({ size = 40, message }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner">
      <Loader2 size={size} className="spinner-icon" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}
