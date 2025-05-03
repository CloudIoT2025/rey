
// 레이셸른 맡은 파트 (Node.js + MQTT + MySQL 기반)

const mqtt = require('mqtt');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'smart_healthcare'
});

db.connect();

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('MQTT Connected');
  client.subscribe('exercise/result');
});

client.on('message', (topic, message) => {
  if (topic === 'exercise/result') {
    const data = JSON.parse(message.toString());
    const { user_id, calories, date } = data;

    db.query(
      'INSERT INTO rsp_move_data (user_id, calories_rsp, date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [user_id, calories, date],
      (err, result) => {
        if (err) console.error(err);
        else console.log('운동 결과 저장 완료:', result.insertId);
      }
    );
  }
});

app.get('/api/calories/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  db.query(
    'SELECT calories_rsp, date FROM rsp_move_data WHERE user_id = ? ORDER BY date DESC',
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB 오류' });
      res.json(rows);
    }
  );
});

app.get('/api/recommendation/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  db.query(
    'SELECT AVG(calories_rsp) as avg_cal FROM rsp_move_data WHERE user_id = ?',
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'DB 오류' });
      const avg = results[0].avg_cal;
      let recommendation;
      if (avg < 200) recommendation = '조깅을 30분 이상 추천드립니다';
      else if (avg < 500) recommendation = '유산소+근력 복합운동 추천';
      else recommendation = '현재 루틴 유지 추천';
      res.json({ recommendation });
    }
  );
});

app.get('/api/users', (req, res) => {
  db.query('SELECT id, username FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
