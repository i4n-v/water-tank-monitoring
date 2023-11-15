// @ts-ignore
import * as mqtt from 'mqtt/dist/mqtt.min';
import { useEffect, useState } from 'react';
import { WaterTank } from '../components';
import { IWaterTank } from '../@types/waterTank';
import MeasurementCard from '../components/MeasurementCard';
import Paginator from '../components/Paginator';
import { useQuery, useQueryClient } from 'react-query';
import useWaterMeasurement from '../services/useWaterMeasurement';
//@ts-ignore
import Home from '../assets/home.svg?react';
import { useNavigate, useParams } from 'react-router-dom';
import useNotifier from '../hooks/useNotifier';

function Dashboard() {
  const [waterTankData, setWaterTankData] = useState<IWaterTank | null>(null);
  const [page, setPage] = useState<number>(1);
  const { id }: any = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifier();

  const { getWaterMeasurements, getBiggestExpense, getLowestExpense } = useWaterMeasurement();

  const queryClient = useQueryClient();

  const getWaterMeasurementsQuery = useQuery(
    ['water-measurements', page, id],
    () => getWaterMeasurements(id, { page, limit: 5 }),
    {
      enabled: !!id,
      onSuccess(response: any) {
        if ('error' in response) notify(response.error, 'error');
      },
    },
  );

  const getBiggestExpenseQuery = useQuery(['biggest_expense', id], () => getBiggestExpense(id), {
    enabled: !!id,
    onSuccess(response: any) {
      if ('error' in response) notify(response.error, 'error');
    },
  });

  const getLowestExpenseQuery = useQuery(['lowest_expense', id], () => getLowestExpense(id), {
    enabled: !!id,
    onSuccess(response: any) {
      if ('error' in response) notify(response.error, 'error');
    },
  });

  useEffect(() => {
    function errorHandler(error: any) {
      if (error) throw error;
    }

    if (id) {
      const client = mqtt.connect('http://localhost:9001');

      try {
        client.on('connect', () => {
          console.log('✅ MQTT connected with success');

          client.subscribe(`receive-data-on-client-${id}`, errorHandler);

          client.subscribe(`connect-on-client-${id}`, errorHandler);

          client.publish('connect-on-server', id);
        });

        client.on('message', (topic: string, message: string) => {
          if ([`connect-on-client-${id}`, `receive-data-on-client-${id}`].includes(topic)) {
            if (topic === `receive-data-on-client-${id}`) {
              queryClient.invalidateQueries();
            }

            const data: IWaterTank = JSON.parse(message.toString());
            setWaterTankData(data);
          }
        });

        return () => {
          client.unsubscribe(`receive-data-on-client-${id}`);
          client.unsubscribe(`connect-on-client-${id}`);
          client.end();
        };
      } catch (error: any) {
        client.unsubscribe(`receive-data-on-client-${id}`);
        client.end();
        console.log('❗ MQTT ERROR:', error);
      }
    }
  }, [id]);

  return (
    <section className="h-screen bg-neutral-900 px-5 flex flex-col gap-14 justify-center">
      <div className="relative">
        <Home
          className="w-12 h-12 bg-blue-400 p-1 rounded-full absolute top-1 cursor-pointer hover:bg-blue-600 transiton delay-150"
          onClick={() => {
            navigate('/');
          }}
        />
        <h1 className="font-extrabold text-center text-transparent text-6xl bg-clip-text bg-gradient-to-r from-blue-200 to-blue-900">
          Water Tank Monitoring
        </h1>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="font-bold text-2xl text-neutral-50">Maior gasto de água</h2>
          {!getBiggestExpenseQuery.data?.error ? (
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
          ) : (
            <p className="text-center text-xl text-neutral-400 animate-pulse">Não registrado.</p>
          )}
          <h2 className="font-bold text-2xl text-neutral-50 mt-10">Menor gasto de água</h2>
          {!getLowestExpenseQuery.data?.error ? (
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
          ) : (
            <p className="text-center text-xl text-neutral-400 animate-pulse">Não registrado.</p>
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
          {!getWaterMeasurementsQuery.data?.items?.length && (
            <p className="text-center text-xl text-neutral-400 animate-pulse">Nenhuma medida registrada.</p>
          )}
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
