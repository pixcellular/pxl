import {Behaviour} from '../../src';
import Action from '../../src/Action';
import Space from '../../src/Space';
import World from '../../src/World';
import {SLEEP} from './Actions';
import {EntityStub} from './EntityStub';

export class MovingBehaviour extends Behaviour<EntityStub> {
  constructor(space: Space) {
    super('moving', (action: Action, entity: EntityStub, world: World) => {
      const location = entity.props.location;
      const destination = location.plus(action.direction.toVector());
      const found = world.getGrid().get(destination);
      if (!found || found.symbol !== space.symbol) {
        return action;
      }
      entity.props.energy -= 10;
      world.getGrid().move(location, destination);
      return SLEEP;
    });
  }
}