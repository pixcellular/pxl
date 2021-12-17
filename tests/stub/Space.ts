import Entity from '../../src/Entity';
import {EntityProps} from '../../src/EntityProps';

export default class Space implements Entity {
  public symbol: string;
  public readonly props: EntityProps = null;

  constructor(symbol: string) {
    this.symbol = symbol;
  }

}

export const SPACE = new Space(' ');
