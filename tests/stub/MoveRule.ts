import Action from '../../src/Action';
import {Rule} from '../../src/RuleGraph';
import World from '../../src/World';
import {SLEEP} from './Actions';
import {EntityStub} from './EntityStub';
import Space from './Space';

export default class MoveRule implements Rule {
  private space: Space;

  constructor(space: Space) {
    this.space = space;
  }

  public enforce(action: Action, entity: EntityStub, world: World): Action {
    const location = entity.props.location;
    const destination = location.plus(action.direction.toVector());
    const found = world.getGrid().get(destination);
    if (!found || found.symbol !== this.space.symbol) {
      return action;
    }
    entity.props.energy -= 10;
    world.getGrid().set(location, this.space);
    world.getGrid().set(destination, entity);
    entity.props.location = destination;
    return SLEEP;
  }
}
