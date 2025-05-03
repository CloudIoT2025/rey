
// mqttBroker.js
const mqtt = require('mqtt');

// EC2 내부나 Docker로 띄운 Mosquitto 브로커 주소
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('✅ MQTT 브로커 연결됨');

  // 서버가 수신할 토픽들
  client.subscribe('move/start/rsp_id');
  client.subscribe('move/end/rsp_id');
  client.subscribe('clientCheck/rsp');

  client.on('message', (topic, message) => {
    const payload = JSON.parse(message.toString());
    console.log(`📨 수신된 메시지 - 토픽: ${topic}`, payload);

    if (topic.startsWith('move/start')) {
      // 운동 시작 처리: 예시 로그
      console.log(`▶️ 운동 시작 - 사용자 ID: ${payload.userid}, URL: ${payload.url}`);
    } else if (topic.startsWith('move/end')) {
      // 운동 종료 처리: 예시 로그
      console.log(`⏹️ 운동 종료 - 사용자 ID: ${payload.userid}, 결과: ${payload.result}`);
    } else if (topic === 'clientCheck/rsp') {
      // 클라이언트 연결 상태 확인
      console.log(`🔄 클라이언트 체크 응답 - 상태: ${payload.status}`);
    }
  });
});

module.exports = client;
