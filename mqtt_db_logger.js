/**
 * MQTT 메시지 수신 후 MySQL DB 저장
 */

const mqtt = require('mqtt');
const mysql = require('mysql2');

// MQTT 브로커에 연결
const client = mqtt.connect('mqtt://localhost:1883');

// MySQL 연결
const db = mysql.createConnection({
    host: 'localhost',
    user: 'moveuser',
    password: 'movepass',
    database: 'movemore'
});

db.connect(err => {
    if (err) {
        console.error('❌ DB 연결 실패:', err);
    } else {
        console.log('✅ MySQL 연결됨');
    }
});

// 브로커 연결 후 pose/result 토픽 구독
client.on('connect', () => {
    console.log('✅ MQTT 브로커에 연결됨');
    client.subscribe('pose/result', (err) => {
        if (!err) {
            console.log('📡 pose/result 토픽 구독 시작');
        }
    });
});

// 메시지 수신 → DB 저장
client.on('message', (topic, message) => {
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
        console.error('❗ JSON 파싱 실패 또는 잘못된 메시지 형식:', e.message);
    }
});
