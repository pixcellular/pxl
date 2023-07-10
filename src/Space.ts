import Entity from './Entity';
import {EntityProps} from './EntityProps';

class Space implements Entity {
  public symbol: string;
  public props: EntityProps;
  public handled = true;

  constructor(symbol: string, props: EntityProps) {
    this.props = props;
    this.symbol = symbol;
  }

}

/**
 * Convenience space entity using the space character as symbol
 */
export const SPACE = new Space(' ', {});
