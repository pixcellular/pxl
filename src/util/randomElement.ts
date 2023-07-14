import randomIndex from './randomIndex';

export default function randomElement(arr: readonly any[]) {
  return arr[randomIndex(arr)];
}
