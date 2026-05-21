import { useEffect, useState } from 'react';
import { getDoctorSlots, cancelAppointment, createSlot, updateAppointmentStatus } from '../services/appointmentService';

function DoctorDashboard() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSlotDate, setNewSlotDate] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getDoctorSlots()
      .then((res) => setSlots(res.data))
      .catch(() => setError('Failed to load slots'))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (appointmentId, slotId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'COMPLETED');
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? { ...s, appointment: { ...s.appointment, status: 'COMPLETED' } }
            : s
        )
      );
      setSuccess('Appointment marked as completed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCancel = async (appointmentId, slotId) => {
    try {
      await cancelAppointment(appointmentId);
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, isBooked: false, appointment: null } : s
        )
      );
      setSuccess('Appointment cancelled and slot is now available.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAddError('');
    setAdding(true);
    try {
      const res = await createSlot({ date: new Date(newSlotDate).toISOString() });
      setSlots((prev) =>
        [...prev, { ...res.data, appointment: null }].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      );
      setNewSlotDate('');
      setSuccess('Slot added successfully.');
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create slot');
    } finally {
      setAdding(false);
    }
  };

  const bookedSlots = slots.filter((s) => s.isBooked);
  const freeSlots = slots.filter((s) => !s.isBooked);

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Doctor Dashboard</h2>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <section className="dashboard-section">
        <h3>Add New Slot</h3>
        <form className="add-slot-form" onSubmit={handleAddSlot}>
          <input
            type="datetime-local"
            value={newSlotDate}
            onChange={(e) => setNewSlotDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
          <button className="btn-primary" type="submit" disabled={adding}>
            {adding ? 'Adding...' : 'Add Slot'}
          </button>
        </form>
        {addError && <p className="error-msg">{addError}</p>}
      </section>

      <section className="dashboard-section">
        <h3>Booked Appointments ({bookedSlots.length})</h3>
        {bookedSlots.length === 0 ? (
          <p className="no-slots">No appointments yet.</p>
        ) : (
          <ul className="appointment-list">
            {bookedSlots.map((slot) => (
              <li key={slot.id} className="appointment-card">
                <div className="appointment-info">
                  <span className="appointment-date">{formatDate(slot.date)}</span>
                  <span className="patient-name">{slot.appointment.patientName}</span>
                  <span className="patient-email">{slot.appointment.patientEmail}</span>
                  {slot.appointment.reason && (
                    <span className="appointment-reason">"{slot.appointment.reason}"</span>
                  )}
                  <span className={`status-badge status-${slot.appointment.status.toLowerCase()}`}>
                    {slot.appointment.status}
                  </span>
                </div>
                {slot.appointment.status === 'PENDING' && (
                  <div className="card-actions">
                    <button
                      className="btn-complete"
                      onClick={() => handleComplete(slot.appointment.id, slot.id)}
                    >
                      Mark Completed
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(slot.appointment.id, slot.id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-section">
        <h3>Available Slots ({freeSlots.length})</h3>
        {freeSlots.length === 0 ? (
          <p className="no-slots">No free slots.</p>
        ) : (
          <ul className="slot-list">
            {freeSlots.map((slot) => (
              <li key={slot.id} className="slot-item free">
                <span className="slot-time">{formatDate(slot.date)}</span>
                <span className="slot-badge">Available</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DoctorDashboard;
