import {EntityProps} from './EntityProps';

/**
 * Create the props of a new Entity by its symbol
 * Parent props are available during the process
 */
export default interface Reproducer {
  reproduce(symbol: string, parentProps?: EntityProps): EntityProps;
}
