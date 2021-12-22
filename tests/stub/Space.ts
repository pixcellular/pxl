import {EntityProps} from '../../src';
import Entity from '../../src/Entity';

export default class Space implements Entity {
  public symbol: string;
  public props: EntityProps;

  constructor(symbol: string, props: EntityProps) {
    this.props = props;
    this.symbol = symbol;
  }

}

export const SPACE = new Space(' ', {} as EntityProps);
