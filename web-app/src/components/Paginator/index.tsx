//@ts-ignore
import LeftArrow from '../../assets/left.svg?react';
//@ts-ignore
import RightArrow from '../../assets/right.svg?react';
import IPaginatorProps from './types';

export default function Paginator({ page, total, onChange }: IPaginatorProps) {
  return (
    <div className="w-full flex justify-between items-center mb-4">
      <button
        type="button"
        className="bg-blue-400 p-2 rounded-sm hover:bg-blue-600 transition delay-100 cursor-pointer disabled:opacity-30 disabled:bg-blue-400"
        disabled={page === 1}
        onClick={() => {
          if (onChange instanceof Function) onChange(page - 1);
        }}
      >
        <LeftArrow className="w-8 h-8" />
      </button>
      <span className="text-md font-bold text-blue-400">
        {page}/{total}
      </span>
      <button
        type="button"
        className="bg-blue-400 p-2 rounded-sm hover:bg-blue-600 transition delay-100 cursor-pointer disabled:opacity-30 disabled:bg-blue-400"
        disabled={page === total}
        onClick={() => {
          if (onChange instanceof Function) onChange(page + 1);
        }}
      >
        <RightArrow className="w-8 h-8" />
      </button>
    </div>
  );
}
