export default function useDebounceCallback(callback: any, delay = 500) {
  let timer: any;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, delay);
  };
}
