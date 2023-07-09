import {SPACE} from '../../src/Space';
import {MovingBehaviour} from './MovingBehaviour';
import SleepingBehaviour from './SleepingBehaviour';

export const moveRule = new MovingBehaviour(SPACE);
export const sleepRule = new SleepingBehaviour(SPACE);
