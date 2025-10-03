import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function GoalSetter({ session }) {
  const [goalType, setGoalType] = useState('Weekly Duration (mins)');
  const [targetValue, setTargetValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('goals').insert({
      user_id: session.user.id,
      goal_type: goalType,
      target_value: parseInt(targetValue, 10),
      start_date: startDate,
      end_date: endDate,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Goal set successfully!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="form-page-container">
      <div className="card form-card">
        <h2>Set a New Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="goalType">Goal Type</label>
            <select
              id="goalType"
              className="inputField"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              required>
              <option>Weekly Duration (mins)</option>
              <option>Weekly Calories</option>
              <option>Total Workouts</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="targetValue">Target Value</label>
            <input
              id="targetValue"
              type="number"
              className="inputField"
              placeholder="e.g., 150"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              className="inputField"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              className="inputField"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Setting...' : 'Set Goal'}
          </button>
        </form>
      </div>
    </div>
  );
}