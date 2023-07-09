import Direction, {NONE} from './Direction';

export type ActionType = string;
export default class Action {
    public type: string;
    public direction: Direction;

    constructor(type: string, direction: Direction = NONE) {
        this.type = type;
        this.direction = direction;
    }

}
