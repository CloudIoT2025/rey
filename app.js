const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'moveuser',
    password: 'movepass',
    database: 'movemore'
});

db.connect(err => {
    if (err) console.error('DB 연결 실패:', err);
    else console.log('DB 연결 성공');
});

app.get('/api/users', (req, res) => {
    db.query('SELECT id, name FROM users', (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

app.get('/api/user/:id/calories', (req, res) => {
    const id = req.params.id;
    db.query('SELECT today_calories, target_calories FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) return res.status(500).send(err);
        if (rows.length === 0) return res.status(404).json({ message: '사용자 없음' });
        res.json(rows[0]);
    });
});

app.get('/api/user/:id/recommend', (req, res) => {
    const id = req.params.id;
    db.query('SELECT today_calories, target_calories FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) return res.status(500).send(err);
        const { today_calories, target_calories } = rows[0];
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

app.post('/api/user/:id/record', (req, res) => {
    const id = req.params.id;
    const { poseAccuracy, caloriesBurned } = req.body;
    db.query('INSERT INTO exercise_logs (user_id, pose_accuracy, calories_burned) VALUES (?, ?, ?)',
        [id, poseAccuracy, caloriesBurned], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ message: '운동 기록 저장됨', logId: result.insertId });
        });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
