import Direction, {directionWithoutNone} from '../Direction';
import randomElement from './randomElement';

/**
 * @return direction other than 'none'
 */
export default function randomDirection(): Direction {
  return randomElement(directionWithoutNone as Direction[]);
}
