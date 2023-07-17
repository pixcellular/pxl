import {EntityProps, EntityPropsWithLocation} from './EntityProps';
import Vector from './Vector';
import World from './World';

export type EntityHandler = (location: Vector, world: World) => void;
/**
 * Representation of a symbol on the map
 */
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
     * Perform behaviour
     */
    handle: EntityHandler;

    /**
     * Used by World to determine if entity has been handled in current turn
     */
    handled?: boolean;

}

export interface EntityWithLocation extends Entity {

    /**
     * Props that can differ between each entity
     */
    props: EntityPropsWithLocation;
}
