import Action from '../../src/Action';
import {Rule} from '../../src/RuleGraph';
import World from '../../src/World';
import {move} from './Actions';
import {EntityStub} from './EntityStub';

export class EntityStubBehaviourRule implements Rule {
  public enforce(action: Action, entity: EntityStub, world: World): Action {
    return new Action(move, entity.props.dir);
  }
}
