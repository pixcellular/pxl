import {EntityHandler} from '../../src';
import {RuleGraph} from '../../src';
import Vector from '../../src/Vector';
import World from '../../src/World';
import {EntityStub} from './EntityStub';

export default class EntityStubHandler implements EntityHandler {

  public readonly rules: RuleGraph;

  constructor(rules: RuleGraph) {
    this.rules = rules;
  }

  /**
   * Let critter act on destination of vector
   */
  public handle(entity: EntityStub, location: Vector, world: World) {
    this.rules.traverse(entity, world);
  }

}
