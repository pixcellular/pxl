import {Behaviour} from '../../src';
import {Entity} from '../../src/';
import {SPACE} from '../../src/Space';
import World from '../../src/World';
import {MOVE, SLEEP} from './Behaviours';
import {EntityStub} from './EntityStub';

export class MovingBehaviour extends Behaviour<EntityStub> {
  constructor(space: Entity = SPACE) {
    super(MOVE, (entity: EntityStub, world: World) => {
      const location = entity.props.location;
      const destination = location.plus(entity.props.dir);
      const found = world.getGrid().get(destination);
      if (found && found.symbol === space.symbol) {
        entity.props.energy -= 10;
        world.getGrid().put(destination, entity);
      }
      return SLEEP;
    }, [SLEEP]);
  }
}
