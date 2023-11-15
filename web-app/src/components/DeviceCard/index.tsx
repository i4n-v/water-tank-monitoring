import IDeviceCardProps from './types';
import { format, parseISO } from 'date-fns';
//@ts-ignore
import DeviceIcon from '../../assets/device.svg?react';
//@ts-ignore
import DeleteIcon from '../../assets/delete.svg?react';
//@ts-ignore
import EditIcon from '../../assets/edit.svg?react';

export default function DeviceCard({
  title,
  description,
  date,
  onClick,
  onEdit,
  onDelete,
  textClass = '',
  iconClass = '',
  className = '',
}: IDeviceCardProps) {
  return (
    <div
      className={`relative flex flex-col gap-1 bg-neutral-50/10 rounded-md shadow-md px-3 py-2 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div
        className={`absolute bg-blue-400 group-hover:bg-white transition delay-150 right-0 top-0 rounded-bl-full rounded-tr-md w-14 h-14 pt-0.5 pl-2.5 ${iconClass}`}
      >
        <DeviceIcon width="48px" height="48px" className="group-hover:fill-blue-400 transition delay-150" />
      </div>
      <span className={`text-md font-bold text-blue-400 group-hover:text-white transition delay-150 ${textClass}`}>
        {title}
      </span>
      <span className="text-sm text-neutral-50">
        <span className="font-bold">Criado em: </span>
        {format(parseISO(date), "dd/MM/yyyy 'às' HH:mm:ss")}
      </span>
      <span className="text-sm text-neutral-50">
        <span className="font-bold">Descrição: </span>
        {description}
      </span>
      <div className="flex justify-end items-center gap-2 border-t border-neutral-600 pt-3 mt-3">
        <EditIcon
          className="bg-blue-400 hover:bg-blue-500 rounded-full p-1 w-8 h-8 cursor-pointer transition delay-150"
          onClick={(event: MouseEvent) => {
            event.stopPropagation();

            if (onEdit instanceof Function) onEdit();
          }}
        />
        <DeleteIcon
          className="bg-red-400 hover:bg-red-500 rounded-full p-1 w-8 h-8 cursor-pointer transition delay-150"
          onClick={(event: MouseEvent) => {
            event.stopPropagation();

            if (onDelete instanceof Function) onDelete();
          }}
        />
      </div>
    </div>
  );
}
