
import React, { useEffect, useState } from 'react';
import { fetchWeeklyCalories } from '../api/api';

const WeeklyChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchWeeklyCalories().then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>주간 칼로리 소모</h2>
      <ul>
        {data.map((entry, idx) => (
          <li key={idx}>{entry.date}: {entry.calories} kcal</li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklyChart;
