import { BehaviourGraph } from '../../src';
import Entity from '../../src/Entity';
import {EntityHandler} from '../../src/Entity';
import {EntityStubProps} from './EntityStubProps';

export class EntityStub implements Entity {
  public props: EntityStubProps;
  public symbol: string;
  public handled: boolean;
  public handle: EntityHandler;

  constructor(props: EntityStubProps, graph: BehaviourGraph<EntityStub>) {
    this.symbol = 'o';
    this.props = props;
    this.handle = (location, world) => graph.traverse(this, world);
    this.handled = false;
  }

}
