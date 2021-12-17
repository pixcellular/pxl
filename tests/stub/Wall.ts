import Entity from '../../src/Entity';

class Wall implements Entity {
    public symbol: string;
    public readonly props = null;

    constructor(symbol: string) {
        this.symbol = symbol;
    }

}

export const WALL = new Wall('#');
