import fixeDecimals from './fixeDecimals';

export default function centimetersToLiters(centimeters: number) {
  const liters = centimeters / 1000;
  const result = fixeDecimals(liters, 2);
  return result;
}
