export function isInRange(value: number, range: [number, number]) {
  return value > range[0] && value < range[1];
}
