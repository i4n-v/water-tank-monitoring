import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"
import { IMqttReceivePayload, IMqttSendPayload } from './@types/mqtt.type';

export default function initMqtt() {
  try {
    const client = mqtt.connect('http://localhost:1883');

    client.on('connect', () => {
      console.log('✅ MQTT connected with success');

      client.subscribe('receive-data-on-server', (error) => {
        if (error) throw error;
      });
    });

    client.on('message', (_, message) => {
      const { height, range, width }: IMqttReceivePayload = JSON.parse(message.toString());

      const totalVolume = width * height;
      const currentVolume = width * (height - range);
      const percentage = (currentVolume / totalVolume) * 100;

      const data: IMqttSendPayload = {
        total_volume: totalVolume,
        current_volume: currentVolume,
        percentage,
      };

      const buffer = Buffer.from(JSON.stringify(data));

      client.publish('receive-data-on-client', buffer);
      console.log('✅ The payload has been sended to client');
    });
  } catch (error: any) {
    console.log('❗ MQTT ERROR:', error);
  }
}
