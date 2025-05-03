
import React, { useEffect, useState } from 'react';
import { fetchUserInfo, fetchExerciseRecommendation } from '../api/api';

const Main = () => {
  const [user, setUser] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    fetchUserInfo().then(res => setUser(res.data));
    fetchExerciseRecommendation().then(res => setRecommendation(res.data));
  }, []);

  return (
    <div>
      <h1>환영합니다 {user?.username}님!</h1>
      <h2>오늘의 추천 운동: {recommendation?.exercise || "로딩 중..."}</h2>
    </div>
  );
};

export default Main;
