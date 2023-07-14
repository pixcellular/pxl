import Direction, {cardinalDirections} from '../Direction';
import randomElement from './randomElement';

/**
 * @return one of the {@link cardinalDirections}
 */
export default function randomDirection(): Direction {
  return randomElement(cardinalDirections);
}
