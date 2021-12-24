import Entity from './Entity';
import {EntityProps} from './EntityProps';

export default class Space implements Entity {
  public symbol: string;
  public props: EntityProps;
  public handled = true;

  constructor(symbol: string, props: EntityProps) {
    this.props = props;
    this.symbol = symbol;
  }

}

export const SPACE = new Space(' ', {} as EntityProps);
