import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProgressChart from './ProgressChart';
import { format } from 'date-fns';

export default function Dashboard({ session }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
      } else {
        setGoals(data);
      }
      setLoading(false);
    };

    fetchGoals();
  }, [session]);

  return (
    <div className="dashboard-container">
      <h2>Your Progress</h2>
      <div className="card chart-card">
        <ProgressChart session={session} />
      </div>

      <h2>Your Goals</h2>
      {loading ? <p>Loading goals...</p> : (
        <div className="goals-grid">
          {goals.length > 0 ? goals.map(goal => (
            <div key={goal.id} className="card goal-card">
              <h3>{goal.goal_type}</h3>
              <p className="goal-target">Target: {goal.target_value}</p>
              <p className="goal-dates">
                {format(new Date(goal.start_date), 'MMM dd, yyyy')} - {format(new Date(goal.end_date), 'MMM dd, yyyy')}
              </p>
            </div>
          )) : <p>You haven't set any goals yet. Go to "Set Goal" to create one!</p>}
        </div>
      )}
    </div>
  );
}