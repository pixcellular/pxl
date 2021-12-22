import Direction, {direction, directionWithoutNone} from './Direction';
import Entity from './Entity';
import randomElement from './util/randomElement';
import Vector from './Vector';
import World from './World';

/**
 * A limited perspective on the world
 */
export default class View {
    private world: World;
    private location: Vector;

    constructor(world: World, location: Vector) {
        this.world = world;
        this.location = location;
    }

    /**
     * Find entity
     * @param dir
     * @return Entity at dir
     * @return null when dir outside of grid
     */
    public look(dir: Direction): Entity | null {
        const target = this.location.plus(dir.toVector());
        if (this.world.getGrid().isInside(target)) {
            return this.world.getGrid().get(target);
        }
        return null;
    }

    /**
     * Find all directions of entities with {symbol}
     * @return Direction[]
     * @return null when not present
     */
    public findAll(symbol: string): Direction[] {
        const found = [];
        for (const dir of directionWithoutNone) {
            const entity = this.look(dir);
            if (entity && entity.symbol === symbol) {
                found.push(dir);
            }
        }
        return found;
    }

    /**
     * Find the directions of an entity with {symbol}
     * Pick random entity when multiple available
     * @return Direction
     * @return null when not present
     */
    public find(symbol: string): Direction {
        const found = this.findAll(symbol);
        if (found.length === 0) {
            return null;
        }
        return randomElement(found);
    }
}
