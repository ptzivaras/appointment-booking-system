import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAvailableSlots, bookAppointment } from '../services/appointmentService';

function BookingPage() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotsForDate, setSlotsForDate] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAvailableSlots()
      .then((res) => setSlots(res.data))
      .catch(() => setError('Failed to load available slots'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const dateStr = selectedDate.toDateString();
    const filtered = slots.filter(
      (slot) => new Date(slot.date).toDateString() === dateStr
    );
    setSlotsForDate(filtered);
    setSelectedSlot(null);
  }, [selectedDate, slots]);

  const availableDates = slots.map((slot) =>
    new Date(slot.date).toDateString()
  );

  const tileClassName = ({ date }) => {
    if (availableDates.includes(date.toDateString())) {
      return 'has-slot';
    }
    return null;
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    setError('');
    setSuccess('');
    try {
      await bookAppointment({ slotId: selectedSlot.id, reason });
      setSuccess('Appointment booked successfully!');
      setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
      setSelectedSlot(null);
      setReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="page">Loading slots...</div>;

  return (
    <div className="booking-page">
      <h2>Book an Appointment</h2>

      <div className="booking-layout">
        <div className="calendar-wrapper">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            minDate={new Date()}
          />
        </div>

        <div className="slots-panel">
          <h3>
            {selectedDate.toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h3>

          {slotsForDate.length === 0 ? (
            <p className="no-slots">No available slots for this date.</p>
          ) : (
            <ul className="slot-list">
              {slotsForDate.map((slot) => (
                <li
                  key={slot.id}
                  className={`slot-item ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <span className="slot-time">
                    {new Date(slot.date).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="slot-doctor">
                    Dr. {slot.doctor.firstName} {slot.doctor.lastName}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {selectedSlot && (
            <div className="booking-form">
              <p className="selected-info">
                Selected: {new Date(selectedSlot.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} — Dr. {selectedSlot.doctor.firstName} {selectedSlot.doctor.lastName}
              </p>
              <textarea
                placeholder="Reason for visit (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <button className="btn-primary" onClick={handleBook} disabled={booking}>
                {booking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
