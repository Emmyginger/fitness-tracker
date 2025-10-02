import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ExerciseLog({ session }) {
  const [exerciseType, setExerciseType] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('exercises').insert({
      user_id: session.user.id,
      exercise_type: exerciseType,
      duration: parseInt(duration, 10),
      calories_burned: parseFloat(calories)
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Exercise logged successfully!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="form-page-container">
      <div className="card form-card">
        <h2>Log Your Workout</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exerciseType">Exercise Type</label>
            <input
              id="exerciseType"
              type="text"
              className="inputField"
              placeholder="e.g., Running, Weightlifting"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              className="inputField"
              placeholder="e.g., 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="calories">Calories Burned</label>
            <input
              id="calories"
              type="number"
              className="inputField"
              placeholder="e.g., 300"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Logging...' : 'Log Exercise'}
          </button>
        </form>
      </div>
    </div>
  );
}