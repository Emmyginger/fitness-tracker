import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ExerciseLog from './components/ExerciseLog';
import GoalSetter from './components/GoalSetter';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container">
        {session && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/" />} />
            <Route path="/log-exercise" element={session ? <ExerciseLog session={session} /> : <Navigate to="/" />} />
            <Route path="/set-goal" element={session ? <GoalSetter session={session} /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;