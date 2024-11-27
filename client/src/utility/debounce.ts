export function debounce(func: Function, delay: number) {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}
