import {EntityHandler} from '../../src/EntityHandler';
import {RuleGraph} from '../../src/RuleGraph';
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
    if (entity.handled) {
      return;
    }
    this.rules.traverse(entity, world);
    entity.handled = true;
  }

}
