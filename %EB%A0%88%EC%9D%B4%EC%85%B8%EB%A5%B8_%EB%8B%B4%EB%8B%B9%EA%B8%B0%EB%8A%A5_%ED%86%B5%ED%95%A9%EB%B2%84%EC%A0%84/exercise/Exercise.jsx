
import React, { useEffect } from 'react';
import mqtt from 'mqtt';

const Exercise = () => {
  useEffect(() => {
    const client = mqtt.connect('ws://your-mqtt-broker:9001');

    const userId = 1;
    const rspId = 123;

    client.on('connect', () => {
      client.publish('move/start/rsp_id', JSON.stringify({ url: 's3url', userid: userId }));
    });

    return () => {
      client.publish('move/end/rsp_id', JSON.stringify({ result: 'complete', userid: userId }));
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>운동 중입니다...</h1>
    </div>
  );
};

export default Exercise;
