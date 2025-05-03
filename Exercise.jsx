
import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const Exercise = () => {
  const [message, setMessage] = useState('');
  const userId = 1; // 예시 사용자 ID

  useEffect(() => {
    const client = mqtt.connect('ws://your-ec2-ip:9001');

    client.on('connect', () => {
      console.log('✅ MQTT 연결됨');

      // 운동 시작 메시지 전송
      client.publish('move/start/rsp_id', JSON.stringify({
        url: 'https://s3bucket.com/video.mp4',
        userid: userId
      }));

      // 운동 종료 메시지 구독
      client.subscribe(`move/end/client_${userId}`);
    });

    client.on('message', (topic, payload) => {
      const data = JSON.parse(payload.toString());
      console.log('📥 수신된 메시지:', topic, data);

      if (topic === `move/end/client_${userId}`) {
        setMessage(`🏁 운동 완료: ${data.result}`);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>운동 중입니다...</h1>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Exercise;
