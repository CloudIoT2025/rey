
const mqtt = require('mqtt');

// MQTT 브로커 주소 (로컬 Mosquitto 또는 EC2 내 MQTT 브로커 주소)
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('✅ MQTT Broker Connected');

  // 서버에서 수신할 topic 구독
  client.subscribe('move/start/rsp_id');
  client.subscribe('move/end/rsp_id');
  client.subscribe('clientCheck/rsp');

  // 메시지 수신 시 처리
  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      console.log(`📨 Topic: ${topic}`);
      console.log('Payload:', payload);

      // 예시 처리
      if (topic.startsWith('move/start')) {
        console.log(`🚀 운동 시작 - 사용자 ${payload.userid}, URL: ${payload.url}`);
        // DB에 시작 상태 기록 또는 로직 실행
      } else if (topic.startsWith('move/end')) {
        console.log(`✅ 운동 종료 - 결과: ${payload.result}, 사용자: ${payload.userid}`);
        // 결과 처리 로직 또는 DB 저장
      } else if (topic === 'clientCheck/rsp') {
        console.log(`🔄 연결 상태 확인 - RSP ID: ${payload.rspId}`);
        // 연결 여부 로직
      }
    } catch (err) {
      console.error('❌ 메시지 처리 오류:', err.message);
    }
  });
});

module.exports = client;
