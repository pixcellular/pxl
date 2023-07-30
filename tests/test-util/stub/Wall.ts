import {Entity, EntityProps} from '../../../src';

export class Wall implements Entity {
    public symbol: string;
    public props: EntityProps;
    public handled = true;

    constructor(symbol: string, props: EntityProps) {
        this.symbol = symbol;
        this.props = props;
    }
    public handle = () => null;
}
