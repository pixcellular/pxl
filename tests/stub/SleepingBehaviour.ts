import {Behaviour} from '../../src';
import {Entity} from '../../src';
import Action from '../../src/Action';
import {SPACE} from '../../src/Space';
import World from '../../src/World';
import {STOP} from './Actions';
import {EntityStub} from './EntityStub';

export default class SleepingBehaviour extends Behaviour<EntityStub> {
  constructor(space: Entity = SPACE) {
    super('sleeping', (action: Action, entity: EntityStub, world: World): Action => {

      // Are we going to die in our sleep?
      if (entity.props.energy <= 0) {
        // Remove from board:
        world.getGrid().set(entity.props.location, space);
      }

      return STOP;
    });
  }

}
