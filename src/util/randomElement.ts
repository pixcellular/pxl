import randomIndex from './randomIndex';

export default function randomElement(arr: any[]) {
  return arr[randomIndex(arr)];
}
