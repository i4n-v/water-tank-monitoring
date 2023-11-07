import IMeasurementCardProps from './types';
import { format, parseISO } from 'date-fns';
//@ts-ignore
import WaterIcon from '../../assets/water.svg?react';
//@ts-ignore
import UpArrow from '../../assets/up.svg?react';
//@ts-ignore
import DownArrow from '../../assets/down.svg?react';

export default function MeasurementCard({
  createdAt,
  currentVolume,
  percentage,
  spentVolume,
  previousSpentVolume,
  textClass = '',
  iconClass = '',
  className = '',
}: IMeasurementCardProps) {
  return (
    <div
      className={`relative flex flex-col gap-1 bg-neutral-50/10 rounded-md shadow-md w-screen max-w-xs px-3 py-2 ${className}`}
    >
      <div
        className={`absolute bg-blue-400 right-0 top-0 rounded-bl-full rounded-tr-md w-14 h-14 pt-2 pl-4 ${iconClass}`}
      >
        <WaterIcon width="48px" height="48px" />
      </div>
      <span className={`text-md font-bold text-blue-400 ${textClass}`}>
        {format(parseISO(createdAt), "dd/MM/yyyy 'às' HH:mm:ss")}
      </span>
      <span className="text-sm text-neutral-50">
        <span className="font-bold">Volume: </span>
        {currentVolume} L
      </span>
      <span className="text-sm text-neutral-50">
        <span className="font-bold">Gasto: </span>
        {spentVolume} L
      </span>
      <span className="text-sm text-neutral-50">
        <span className="font-bold">Ocupação: </span>
        {percentage}%
      </span>
      {spentVolume > previousSpentVolume! && (
        <UpArrow className="fill-red-500 absolute bottom-2 right-2 w-8 h-8 animate-bounce" />
      )}
      {spentVolume < previousSpentVolume! && (
        <DownArrow className="fill-green-600 absolute bottom-2 right-2 w-8 h-8 animate-bounce" />
      )}
    </div>
  );
}
