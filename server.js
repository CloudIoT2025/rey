
const express = require('express');
const cors = require('cors');
const mqttClient = require('./mqttBroker'); // MQTT 연동

const app = express();
app.use(cors());
app.use(express.json());

// 사용자 정보 API
app.get('/api/user/info', (req, res) => {
  res.json({ username: '레이셸른' });
});

// 운동 추천 API
app.get('/api/exercise/recommend', (req, res) => {
  res.json({ exercise: '스쿼트 3세트' });
});

// 주간 칼로리 API
app.get('/api/exercise/weekly', (req, res) => {
  res.json([
    { date: '2024-04-22', calories: 500 },
    { date: '2024-04-23', calories: 600 },
    { date: '2024-04-24', calories: 550 },
    { date: '2024-04-25', calories: 520 },
    { date: '2024-04-26', calories: 640 },
    { date: '2024-04-27', calories: 580 },
    { date: '2024-04-28', calories: 610 }
  ]);
});

// 서버 시작
app.listen(5000, () => {
  console.log('✅ Node API 서버 실행 중: http://localhost:5000');
});
