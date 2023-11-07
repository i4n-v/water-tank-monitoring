export default function fixeDecimals(number: number, decimals: number) {
  return parseFloat(number.toFixed(decimals));
}
