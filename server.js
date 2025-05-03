
const express = require('express');
const cors = require('cors');
const mqttClient = require('./mqttBroker');

const app = express();
app.use(cors());
app.use(express.json());

// 유저 정보 API
app.get('/api/user/info', (req, res) => {
  res.json({ username: '레이셸른' });
});

// 자동 운동 추천 API
app.get('/api/exercise/recommend', (req, res) => {
  res.json({ exercise: '스쿼트 3세트' });
});

// 주간 칼로리 데이터 API
app.get('/api/exercise/weekly', (req, res) => {
  res.json([
    { date: '2024-04-22', calories: 500 },
    { date: '2024-04-23', calories: 600 },
    { date: '2024-04-24', calories: 550 },
    { date: '2024-04-25', calories: 700 },
    { date: '2024-04-26', calories: 650 },
    { date: '2024-04-27', calories: 800 },
    { date: '2024-04-28', calories: 550 }
  ]);
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Node API 서버 실행 중: http://localhost:${PORT}`);
});
