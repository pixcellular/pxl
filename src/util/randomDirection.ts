import {direction} from '../Direction';
import randomElement from './randomElement';

/**
 * @return direction other than 'none'
 */
export default function randomDirection() {
  const withoutNone = direction.slice(0, -1);
  return randomElement(withoutNone);
}
