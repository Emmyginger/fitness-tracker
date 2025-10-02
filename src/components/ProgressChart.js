import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../supabaseClient';
import { format, subDays } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProgressChart({ session }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      const { data, error } = await supabase
        .from('exercises')
        .select('created_at, calories_burned')
        .eq('user_id', session.user.id)
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching exercise data:', error);
        return;
      }

      const labels = [];
      const dataPoints = [];
      const aggregatedData = {};

      // Aggregate data by day
      data.forEach(exercise => {
        const day = format(new Date(exercise.created_at), 'yyyy-MM-dd');
        if (!aggregatedData[day]) {
          aggregatedData[day] = 0;
        }
        aggregatedData[day] += exercise.calories_burned;
      });

      // Create labels for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const label = format(date, 'MMM dd');
        labels.push(label);
        dataPoints.push(aggregatedData[formattedDate] || 0);
      }

      setChartData({
        labels,
        datasets: [
          {
            label: 'Calories Burned',
            data: dataPoints,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.3
          },
        ],
      });
    };

    fetchExerciseData();
  }, [session]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Calories Burned in the Last 7 Days',
        font: {
            size: 18,
        }
      },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  if (!chartData) {
    return <p>Loading chart data...</p>;
  }

  return <Line data={chartData} options={options} />;
}