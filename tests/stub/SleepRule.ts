import {Rule} from '../../src';
import Action from '../../src/Action';
import Space from '../../src/Space';
import World from '../../src/World';
import {EXIT} from './Actions';
import {EntityStub} from './EntityStub';

export default class SleepRule implements Rule {

  private space: Space;

  constructor(space: Space) {
    this.space = space;
  }

  public enforce(action: Action, entity: EntityStub, world: World): Action {
    // Lets die peacefully?
    if (entity.props.energy <= 0) {
      // remove from board:
      world.getGrid().set(entity.props.location, this.space);
    }

    return EXIT;
  }
}
