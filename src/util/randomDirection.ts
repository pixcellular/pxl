import Direction, {directionNotZero} from '../Direction';
import randomElement from './randomElement';

/**
 * @return direction other than 'zero'
 */
export default function randomDirection(): Direction {
  return randomElement(directionNotZero as Direction[]);
}
