import Direction, {ZERO} from './Direction';

export type ActionType = string;
export default class Action {
    public name: string;
    public direction: Direction;

    constructor(type: string, direction: Direction = ZERO) {
        this.name = type;
        this.direction = direction;
    }

}
