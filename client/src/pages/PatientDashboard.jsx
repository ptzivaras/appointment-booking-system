import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyAppointments, cancelAppointment } from '../services/appointmentService';

const STATUS_LABEL = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError('Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

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
      <h2>My Appointments</h2>

      {error && <p className="error-msg">{error}</p>}

      <div className="dashboard-section">
        <button className="btn-primary book-btn" onClick={() => navigate('/book')}>
          + Book New Appointment
        </button>
      </div>

      <div className="dashboard-section">
        {appointments.length === 0 ? (
          <p className="no-slots">You have no appointments yet.</p>
        ) : (
          <ul className="appointment-list">
            {appointments.map((appt) => (
              <li key={appt.id} className="appointment-card">
                <div className="appointment-info">
                  <span className="appointment-date">{formatDate(appt.slot.date)}</span>
                  <span className="patient-name">
                    Dr. {appt.slot.doctor.firstName} {appt.slot.doctor.lastName}
                  </span>
                  {appt.reason && (
                    <span className="appointment-reason">"{appt.reason}"</span>
                  )}
                  <span className={`status-badge status-${appt.status.toLowerCase()}`}>
                    {STATUS_LABEL[appt.status]}
                  </span>
                </div>
                {appt.status === 'PENDING' && (
                  <button className="btn-cancel" onClick={() => handleCancel(appt.id)}>
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
