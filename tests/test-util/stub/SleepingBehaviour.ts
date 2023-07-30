import {Behaviour, BehaviourName, World} from '../../../src';
import {SLEEP, STOP} from './Behaviours';
import {EntityStub} from './EntityStub';

export default class SleepingBehaviour extends Behaviour<EntityStub> {
  constructor() {
    super(SLEEP, (entity: EntityStub, world: World): BehaviourName => {

      // Are we going to die in our sleep?
      if (entity.props.energy <= 0) {
        // Remove from board:
        world.getGrid().remove(entity.props.location);
      }

      return STOP;
    }, [STOP]);
  }

}
