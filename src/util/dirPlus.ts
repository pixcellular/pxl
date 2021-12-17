import Direction, {cardinalDirections, direction} from '../Direction';

export default function dirPlus(dir: Direction, n: number): Direction {
  const index = cardinalDirections.indexOf(dir.toString());
  const newIndex = (index + n + 8) % 8;
  return direction[newIndex];
}
