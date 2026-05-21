import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">MedBook</Link>
      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'doctor' && <Link to="/doctor">Dashboard</Link>}
            {user.role === 'patient' && <Link to="/patient">My Appointments</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
