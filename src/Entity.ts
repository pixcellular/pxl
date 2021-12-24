import {EntityProps} from './EntityProps';

export default interface Entity {

    /**
     * Props that can differ between each entity
     */
    props: EntityProps;

    /**
     * Symbol on the map
     * as seen on grid.toString()
     */
    symbol: string;

    /**
     * Used by World to determine if entity has been handled in current turn
     */
    handled?: boolean;
}
