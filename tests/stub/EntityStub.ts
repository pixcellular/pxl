import Entity from '../../src/Entity';
import {EntityStubProps} from './EntityStubProps';

export class EntityStub implements Entity {
  public props: EntityStubProps;
  public symbol: string;
  public handled: boolean;

  constructor(props: EntityStubProps) {
    this.symbol = 'o';
    this.props = props;
    this.handled = false;
  }
}
