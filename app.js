const express = require('express');
const mysql = require('mysql2');
const mqtt = require('mqtt');
const app = express();
app.use(express.json());

// ✅ MySQL 연결
const db = mysql.createConnection({
    host: 'localhost',
    user: 'moveuser',
    password: 'movepass',
    database: 'movemore'
});
db.connect(err => {
    if (err) console.error('DB 연결 실패:', err);
    else console.log('✅ MySQL 연결 성공');
});

// ✅ MQTT 연결 및 수신 처리
const mqttClient = mqtt.connect('mqtt://localhost:1883');
mqttClient.on('connect', () => {
    console.log('✅ MQTT 브로커에 연결됨');
    mqttClient.subscribe('pose/result', err => {
        if (!err) {
            console.log('📡 pose/result 토픽 구독 시작');
        }
    });
});

mqttClient.on('message', (topic, message) => {
    console.log(`[📨 수신됨] ${topic}: ${message.toString()}`);
    try {
        const data = JSON.parse(message.toString());
        const { userId, poseAccuracy, caloriesBurned } = data;
        const sql = 'INSERT INTO exercise_logs (user_id, pose_accuracy, calories_burned) VALUES (?, ?, ?)';
        db.query(sql, [userId, poseAccuracy, caloriesBurned], (err, result) => {
            if (err) {
                console.error('❌ DB 저장 오류:', err);
            } else {
                console.log('✅ 운동 기록 저장 완료 (log ID:', result.insertId, ')');
            }
        });
    } catch (e) {
        console.error('❗ JSON 파싱 실패:', e.message);
    }
});

// ✅ 유저 전체 조회
app.get('/api/users', (req, res) => {
    db.query('SELECT id, name FROM users', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// ✅ 칼로리 조회
app.get('/api/user/:id/calories', (req, res) => {
    const id = req.params.id;
    db.query('SELECT today_calories, target_calories FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).json({ message: '유저 없음' });
        res.json(result[0]);
    });
});

// ✅ 운동 추천
app.get('/api/user/:id/recommend', (req, res) => {
    const id = req.params.id;
    db.query('SELECT today_calories, target_calories FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).json({ message: '유저 없음' });
        const { today_calories, target_calories } = result[0];
        const deficit = target_calories - today_calories;

        let level = 'low';
        if (deficit > 500) level = 'high';
        else if (deficit > 200) level = 'mid';

        const videos = {
            low: ['stretch1.mp4'],
            mid: ['cardio1.mp4'],
            high: ['hiit1.mp4']
        };

        res.json({ recommendedLevel: level, videos: videos[level] });
    });
});

// ✅ 운동 기록 저장
app.post('/api/user/:id/record', (req, res) => {
    const id = req.params.id;
    const { poseAccuracy, caloriesBurned } = req.body;
    const sql = 'INSERT INTO exercise_logs (user_id, pose_accuracy, calories_burned) VALUES (?, ?, ?)';
    db.query(sql, [id, poseAccuracy, caloriesBurned], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: '운동 기록 저장됨', logId: result.insertId });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
