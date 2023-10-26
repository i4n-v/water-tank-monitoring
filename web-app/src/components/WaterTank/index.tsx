import CountUp from 'react-countup';
import IWaterTankProps from './types';

export default function WaterTank({ totalVolume, percentage, currentVolume }: IWaterTankProps) {
  const waves = [
    'bg-blue-700 -bottom-12 opacity-50',
    'bg-blue-500 inverse -bottom-5 opacity-20',
    'bg-blue-300 bottom-0 opacity-20',
    'bg-blue-300 inverse bottom-0 opacity-20',
  ];

  return (
    <div className="flex gap-4">
      <div className="flex flex-col text-neutral-50 text-lg justify-between items-end">
        <span>{totalVolume} L</span>
        <span>0 L</span>
      </div>
      <div className="w-screen max-w-4xl h-[48rem] border-8 border-t-0 rounded-3xl rounded-t-none border-neutral-500 overflow-hidden relative flex justify-center items-center">
        <div className="text-3xl bg-neutral-900/50 backdrop-blur-3xl text-neutral-50 rounded-lg px-4 py-2 z-10 flex flex-col items-center gap-2">
          <span>
            <CountUp end={percentage} duration={5} />%
          </span>
          <span>
            <CountUp end={currentVolume} duration={5} /> L
          </span>
        </div>
        {waves.map((className) => (
          <div
            style={{ height: `${percentage}%` }}
            className={
              'w-full rounded-3xl rounded-t-none clip wave absolute transition-all delay-300 ease-in-out ' + className
            }
          />
        ))}
      </div>
    </div>
  );
}
