import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"
import { IMqttReceivePayload } from './@types/mqtt.type';
import WaterMeasurementsRepositorie from './repositories/waterMeasurements.repositorie';
import centimetersToLiters from './utils/centimetersToLiters';
import fixeDecimals from './utils/fixeDecimals';

export default function initMqtt() {
  function errorHandler(error: any) {
    if (error) throw error;
  }

  try {
    const client = mqtt.connect('http://localhost:1883');

    client.on('connect', () => {
      console.log('✅ MQTT connected with success');

      client.subscribe('receive-data-on-server', errorHandler);

      client.subscribe('connect-on-server', errorHandler);
    });

    client.on('message', async (topic, message) => {
      if (topic === 'connect-on-server') {
        const deviceId = message.toString();
        const previousMeasurement = await WaterMeasurementsRepositorie.findLastByDeviceId(deviceId);

        if (previousMeasurement) {
          const waterMeasurementBuffer = Buffer.from(JSON.stringify(previousMeasurement));
          client.publish('connect-on-client', waterMeasurementBuffer);
        }
      } else if (topic === 'receive-data-on-server') {
        const { device_id, height, range, width }: IMqttReceivePayload = JSON.parse(
          message.toString()
        );

        const radius = width / 2;
        const area = Math.PI * (radius * 2);
        const totalVolume = centimetersToLiters(area * height);
        const currentVolume = centimetersToLiters(area * (height - range));
        const percentage = fixeDecimals((currentVolume / totalVolume) * 100, 2);
        let spentVolume = 0;

        const previousMeasurement = await WaterMeasurementsRepositorie.findLastByDeviceId(
          device_id
        );

        if (previousMeasurement) {
          spentVolume = previousMeasurement.current_volume - currentVolume;
          spentVolume = spentVolume < 0 ? 0 : spentVolume;
        }

        if (!previousMeasurement || currentVolume !== previousMeasurement.current_volume) {
          const waterMeasurement = await WaterMeasurementsRepositorie.create({
            total_volume: totalVolume,
            current_volume: currentVolume,
            spent_volume: spentVolume,
            percentage,
          });

          const waterMeasurementBuffer = Buffer.from(JSON.stringify(waterMeasurement));
          client.publish('receive-data-on-client', waterMeasurementBuffer);
        }
      }
    });
  } catch (error: any) {
    console.log('❗ MQTT ERROR:', error);
  }
}
