import Action from '../../src/Action';
import {NONE} from '../../src/Direction';

export const exit = 'exit';
export const move = 'move';
export const sleep = 'sleep';

export const EXIT = new Action('exit', NONE);
export const SLEEP = new Action('sleep', NONE);
