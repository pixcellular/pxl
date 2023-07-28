/**
 * @param fn - Function to memoize function
 * @param toKey - Convert arguments to key to memoize by
 */
export function memoize<T>(
    fn: (...args: any[]) => T,
    toKey: (...args: any[]) => any
) {
  const cache: any = {};
  return (...args: any[]) => {
    const key = toKey(...args);
    if (key in cache) {
      return cache[key];
    } else {
      const result = fn(...args);
      cache[key] = result;
      return result;
    }
  };
}
