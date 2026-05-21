import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePatientClick = () => {
    if (user) {
      navigate('/book');
    } else {
      navigate('/login');
    }
  };

  const handleDoctorClick = () => {
    if (user) {
      navigate('/doctor');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to MedBook</h1>
        <p>Book your doctor appointment in seconds. Simple, fast and reliable.</p>
      </div>

      <div className="home-cards">
        <div className="home-card" onClick={handlePatientClick}>
          <div className="home-card-icon">🗓</div>
          <h3>I'm a Patient</h3>
          <p>Browse available slots and book an appointment with your doctor.</p>
          <button className="btn-primary">Book Appointment</button>
        </div>

        <div className="home-card" onClick={handleDoctorClick}>
          <div className="home-card-icon">🩺</div>
          <h3>I'm a Doctor</h3>
          <p>Manage your available slots and view your upcoming appointments.</p>
          <button className="btn-primary">Go to Dashboard</button>
        </div>
      </div>

      {!user && (
        <p className="home-note">
          Please <span className="link-text" onClick={() => navigate('/login')}>login</span> or{' '}
          <span className="link-text" onClick={() => navigate('/register')}>register</span> to get started.
        </p>
      )}
    </div>
  );
}

export default HomePage;
