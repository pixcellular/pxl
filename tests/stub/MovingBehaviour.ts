import {Behaviour} from '../../src';
import {Entity} from '../../src/';
import Action from '../../src/Action';
import {SPACE} from '../../src/Space';
import World from '../../src/World';
import {SLEEP} from './Actions';
import {EntityStub} from './EntityStub';

export class MovingBehaviour extends Behaviour<EntityStub> {
  constructor(space: Entity = SPACE) {
    super('moving', (action: Action, entity: EntityStub, world: World) => {
      const location = entity.props.location;
      const destination = location.plus(action.direction);
      const found = world.getGrid().get(destination);
      if (!found || found.symbol !== space.symbol) {
        return action;
      }
      entity.props.energy -= 10;
      world.getGrid().put(destination, entity);
      return SLEEP;
    });
  }
}
