import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand">VitalityVault</Link>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/log-exercise">Log Exercise</Link>
        <Link to="/set-goal">Set Goal</Link>
        <button onClick={handleLogout} className="button-secondary">Logout</button>
      </div>
    </nav>
  );
}