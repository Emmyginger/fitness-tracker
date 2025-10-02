import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.error_description || error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('Check your email for the login link!');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1 className="header">{isSignUp ? 'Join VitalityVault' : 'Welcome Back'}</h1>
        <p className="description">{isSignUp ? 'Start your fitness journey today.' : 'Log in to track your progress.'}</p>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <input
              className="inputField"
              type="text"
              placeholder="Your username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputField"
            type="password"
            placeholder="Your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button className="button-primary" disabled={loading}>
              {loading ? <span>Loading...</span> : <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>}
            </button>
          </div>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="auth-toggle-button">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}