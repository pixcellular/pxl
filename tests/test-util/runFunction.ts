export function runFunction<T>(
    fn: (...args: any[]) => T,
    times: number,
    args: any[]
) {
  const result = [];
  for (let i = 0; i < times; i++) {
    result.push(fn(...args));
  }
  return result;
}
