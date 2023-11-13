// @ts-ignore
import * as mqtt from 'mqtt/dist/mqtt.min';
import { useEffect, useState } from 'react';
import { WaterTank } from '../components';
import { IWaterTank } from '../@types/waterTank';
import MeasurementCard from '../components/MeasurementCard';
import Paginator from '../components/Paginator';
import { useQuery, useQueryClient } from 'react-query';
import useWaterMeasurement from '../services/useWaterMeasurement';

function Dashboard() {
  const [waterTankData, setWaterTankData] = useState<IWaterTank | null>(null);
  const [page, setPage] = useState<number>(1);

  const { getWaterMeasurements, getBiggestExpense, getLowestExpense } = useWaterMeasurement();

  const queryClient = useQueryClient();

  const getWaterMeasurementsQuery = useQuery(['water-measurements', page], () =>
    getWaterMeasurements({ page, limit: 5 }),
  );

  const getBiggestExpenseQuery = useQuery(['biggest_expense'], getBiggestExpense);

  const getLowestExpenseQuery = useQuery(['lowest_expense'], getLowestExpense);

  useEffect(() => {
    const client = mqtt.connect('http://localhost:9001');

    function errorHandler(error: any) {
      if (error) throw error;
    }

    try {
      client.on('connect', () => {
        console.log('✅ MQTT connected with success');

        client.subscribe('receive-data-on-client', errorHandler);

        client.subscribe('connect-on-client', errorHandler);

        client.publish('connect-on-server', null);
      });

      client.on('message', (topic: string, message: string) => {
        if (['connect-on-client', 'receive-data-on-client'].includes(topic)) {
          if (topic === 'receive-data-on-client') {
            queryClient.invalidateQueries();
          }

          const data: IWaterTank = JSON.parse(message.toString());
          setWaterTankData(data);
        }
      });

      return () => {
        client.unsubscribe('receive-data-on-client');
        client.unsubscribe('connect-on-client');
        client.end();
      };
    } catch (error: any) {
      client.unsubscribe('receive-data-on-client');
      client.end();
      console.log('❗ MQTT ERROR:', error);
    }
  }, []);

  return (
    <section className="h-screen bg-neutral-900 px-5 flex flex-col gap-14 justify-center">
      <h1 className="font-extrabold text-transparent text-center text-6xl bg-clip-text bg-gradient-to-r from-blue-200 to-blue-900">
        Water Tank Monitoring
      </h1>
      <div className="flex justify-between">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="font-bold text-2xl text-neutral-50">Maior gasto de água</h2>
          {getBiggestExpenseQuery.data && (
            <MeasurementCard
              createdAt={getBiggestExpenseQuery.data.created_at}
              currentVolume={getBiggestExpenseQuery.data.current_volume}
              spentVolume={getBiggestExpenseQuery.data.spent_volume}
              percentage={getBiggestExpenseQuery.data.percentage}
              previousSpentVolume={0}
              textClass="text-red-500"
              iconClass="bg-red-500"
              className="animate-pulse"
            />
          )}
          <h2 className="font-bold text-2xl text-neutral-50 mt-10">Menor gasto de água</h2>
          {getLowestExpenseQuery.data && (
            <MeasurementCard
              createdAt={getLowestExpenseQuery.data.created_at}
              currentVolume={getLowestExpenseQuery.data.current_volume}
              spentVolume={getLowestExpenseQuery.data.spent_volume}
              percentage={getLowestExpenseQuery.data.percentage}
              previousSpentVolume={-1}
              textClass="text-green-500"
              iconClass="bg-green-500"
              className="animate-pulse"
            />
          )}
        </div>
        <WaterTank
          currentVolume={waterTankData?.current_volume || 0}
          percentage={waterTankData?.percentage || 0}
          totalVolume={waterTankData?.total_volume || 0}
        />
        <div className="flex flex-col gap-2">
          <Paginator
            page={page}
            total={getWaterMeasurementsQuery.data?.totalPages || 0}
            onChange={(page) => setPage(page)}
          />
          {getWaterMeasurementsQuery.data?.items?.map((measurement: IWaterTank, index: number, array: IWaterTank[]) => (
            <MeasurementCard
              key={measurement.id}
              createdAt={measurement.created_at}
              currentVolume={measurement.current_volume}
              spentVolume={measurement.spent_volume}
              percentage={measurement.percentage}
              previousSpentVolume={array[index - 1]?.spent_volume}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
