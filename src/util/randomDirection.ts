import {direction, directionWithoutNone} from '../Direction';
import randomElement from './randomElement';

/**
 * @return direction other than 'none'
 */
export default function randomDirection() {
  return randomElement(directionWithoutNone);
}
