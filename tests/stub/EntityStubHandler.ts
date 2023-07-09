import {BehaviourGraph, EntityHandler} from '../../src';
import Vector from '../../src/Vector';
import World from '../../src/World';
import {EntityStub} from './EntityStub';

export default class EntityStubHandler implements EntityHandler {

  public readonly rules: BehaviourGraph<EntityStub>;

  constructor(rules: BehaviourGraph<EntityStub>) {
    this.rules = rules;
  }

  /**
   * Let critter act on destination of vector
   */
  public handle(entity: EntityStub, location: Vector, world: World) {
    this.rules.traverse(entity, world);
  }

}
