import Direction from './Direction';

export default class Action {
    public type: string;
    public direction: Direction;

    constructor(type: string, direction: Direction) {
        this.type = type;
        this.direction = direction;
    }

}
