import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, Users, FileText } from 'lucide-react';
import { toursApi, bookingsApi } from '../api';
import type { TourPackage, TourSchedule, BookingParticipant } from '../types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const tourId = Number(searchParams.get('tour_id'));
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [schedules, setSchedules] = useState<TourSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedSchedule, setSelectedSchedule] = useState<number>(0);
  const [travelDate, setTravelDate] = useState('');
  const [notes, setNotes] = useState('');
  const [participants, setParticipants] = useState<BookingParticipant[]>([
    { name: '', id_card_number: '' },
  ]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!tourId) {
      navigate('/tours');
      return;
    }

    Promise.all([
      toursApi.get(tourId),
      toursApi.getSchedules(tourId).catch(() => []),
    ]).then(([tourData, schedulesData]) => {
      setTour(tourData);
      const schedList = Array.isArray(schedulesData) ? schedulesData : [];
      setSchedules(schedList);
      if (schedList.length > 0) {
        setSelectedSchedule(schedList[0].id);
        setTravelDate(schedList[0].start_date.split('T')[0]);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      navigate('/tours');
    });
  }, [tourId, user, authLoading, navigate]);

  const handleParticipantChange = (
    index: number,
    field: keyof BookingParticipant,
    value: string
  ) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const addParticipant = () => {
    if (tour && participants.length >= tour.max_participants) return;
    setParticipants([...participants, { name: '', id_card_number: '' }]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length <= 1) return;
    const updated = participants.filter((_, i) => i !== index);
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emptyParticipant = participants.find((p) => !p.name || !p.id_card_number);
    if (emptyParticipant) {
      setError('Please fill in all participant details.');
      return;
    }

    if (!selectedSchedule) {
      setError('Please select a schedule.');
      return;
    }

    setSubmitting(true);
    try {
      const booking = await bookingsApi.create({
        tour_package_id: tourId,
        tour_schedule_id: selectedSchedule,
        travel_date: travelDate,
        num_participants: participants.length,
        notes,
        participants,
      });
      navigate(`/bookings/${booking.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner message="Loading booking form..." />;
  if (!tour) return null;

  const displayPrice = tour.discount_price ?? tour.price;

  return (
    <div className="create-booking-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="page-header">
          <h1>Book Your Trip</h1>
          <p>Complete the form below to book your tour</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="create-booking-layout">
          <form className="create-booking-form" onSubmit={handleSubmit}>
            {/* Tour Summary */}
            <div className="card booking-tour-summary">
              <div className="booking-tour-summary-content">
                <img
                  src={tour.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=150&fit=crop'}
                  alt={tour.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=150&fit=crop';
                  }}
                />
                <div>
                  <h3>
                    <Link to={`/tours/${tour.id}`}>{tour.title}</Link>
                  </h3>
                  <p className="text-muted">{tour.duration_days} days • Max {tour.max_participants} people</p>
                  <p className="price-main">Rp {displayPrice.toLocaleString('id-ID')} /person</p>
                </div>
              </div>
            </div>

            {/* Schedule Selection */}
            <div className="card">
              <h3><Calendar size={18} /> Select Schedule</h3>
              {schedules.length > 0 ? (
                <div className="schedule-options">
                  {schedules.map((schedule) => (
                    <label key={schedule.id} className={`schedule-option ${selectedSchedule === schedule.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="schedule"
                        value={schedule.id}
                        checked={selectedSchedule === schedule.id}
                        onChange={() => {
                          setSelectedSchedule(schedule.id);
                          setTravelDate(schedule.start_date.split('T')[0]);
                        }}
                      />
                      <div>
                        <strong>
                          {new Date(schedule.start_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {' — '}
                          {new Date(schedule.end_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </strong>
                        <span className="text-muted">{schedule.available_slots} slots available</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="travel-date">Travel Date</label>
                  <input
                    id="travel-date"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Participants */}
            <div className="card">
              <div className="card-header">
                <h3><Users size={18} /> Participants</h3>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={addParticipant}
                  disabled={participants.length >= tour.max_participants}
                >
                  <Plus size={16} /> Add Participant
                </button>
              </div>
              <div className="participants-form">
                {participants.map((participant, idx) => (
                  <div key={idx} className="participant-row">
                    <div className="participant-number">{idx + 1}</div>
                    <div className="participant-fields">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          placeholder="Participant name"
                          value={participant.name}
                          onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>ID Card Number</label>
                        <input
                          type="text"
                          placeholder="ID card number"
                          value={participant.id_card_number}
                          onChange={(e) =>
                            handleParticipantChange(idx, 'id_card_number', e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    {participants.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon btn-danger-icon"
                        onClick={() => removeParticipant(idx)}
                        aria-label="Remove participant"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="card">
              <h3><FileText size={18} /> Additional Notes</h3>
              <div className="form-group">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Any special requests or notes for this booking..."
                />
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="card booking-summary-card">
              <h3>Booking Summary</h3>
              <div className="summary-row">
                <span>Tour</span>
                <span>{tour.title}</span>
              </div>
              <div className="summary-row">
                <span>Price per person</span>
                <span>Rp {displayPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-row">
                <span>Participants</span>
                <span>{participants.length} people</span>
              </div>
              <div className="summary-row summary-total">
                <span>Estimated Total</span>
                <span>Rp {(displayPrice * participants.length).toLocaleString('id-ID')}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
