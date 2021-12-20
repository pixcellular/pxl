import Direction, {direction} from './Direction';
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

    public look(dir: Direction) {
        const target = this.location.plus(dir.toVector());
        if (this.world.getGrid().isInside(target)) {
            return this.world.getGrid().get(target).symbol;
        }
        return null;
    }

    public findAll(symbol: string): Direction[] {
        const found = [];
        for (const dir of direction) {
            if (this.look(dir) === symbol) {
                found.push(dir);
            }
        }
        return found;
    }

    /**
     * Find an entity with {symbol}
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
