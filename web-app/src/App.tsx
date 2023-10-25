import * as mqtt from 'mqtt/dist/mqtt.min';
import { useEffect, useState } from 'react';
import { WaterTank } from './components';
import { IWaterTank } from './@types/waterTank';

function App() {
  const [waterTankData, setWaterTankData] = useState<IWaterTank | null>(null);

  useEffect(() => {
    const client = mqtt.connect('http://localhost:9001');

    try {
      client.on('connect', () => {
        console.log('✅ MQTT connected with success');

        client.subscribe('receive-data-on-client', (error) => {
          if (error) throw error;
        });
      });

      client.on('message', (_, message) => {
        const data: IWaterTank = JSON.parse(message.toString());
        setWaterTankData(data);
      });

      return () => {
        client.unsubscribe('receive-data-on-client');
        client.end();
      };
    } catch (error: any) {
      client.unsubscribe('receive-data-on-client');
      client.end();
      console.log('❗ MQTT ERROR:', error);
    }
  }, []);

  return (
    <section className="h-screen bg-neutral-900 px-5 flex flex-col gap-14 justify-center items-center">
      <p className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-blue-200 to-blue-900">
        Water tank monitoring
      </p>
      <WaterTank
        currentVolume={waterTankData?.current_volume || 0}
        percentage={waterTankData?.percentage || 0}
        totalVolume={waterTankData?.total_volume || 0}
      />
    </section>
  );
}

export default App;
