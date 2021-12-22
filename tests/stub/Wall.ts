import {EntityProps} from '../../src';
import Entity from '../../src/Entity';

class Wall implements Entity {
    public symbol: string;
    public props: EntityProps;

    constructor(symbol: string, props: EntityProps) {
        this.symbol = symbol;
        this.props = props;
    }

}

export const WALL = new Wall('#', {} as EntityProps);
