import Direction, {directionWithoutNone} from './Direction';
import Entity from './Entity';
import randomIndex from './util/randomIndex';
import Vector from './Vector';
import World from './World';

/**
 * A limited perspective of 1 cell in all directions
 * Vector destination = location + direction
 */
export default class View {
  private world: World;
  private location: Vector;

  constructor(world: World, location: Vector) {
    this.world = world;
    this.location = location;
  }

  /**
   * Get an entity by its location relative to View.location
   * Vector location + direction = destination
   * @return Entity at destination
   * @return null when dir outside of grid
   */
  public get(dir: Direction): Entity | null {
    const target = this.location.plus(dir.toVector());
    if (this.world.getGrid().isInside(target)) {
      return this.world.getGrid().get(target);
    }
    return null;
  }

  /**
   * Set entity at destination
   * Destination = location + direction
   */
  public set(dir: Direction, entity: Entity) {
    const target = this.location.plus(dir.toVector());
    this.world.getGrid().set(target, entity);
  }

  /**
   * Find all entities that match predicate
   * @return Direction[] of entities
   */
  public filter(predicate: (e: Entity) => boolean): Direction[] {
    const found = [];
    for (const dir of directionWithoutNone) {
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        found.push(dir);
      }
    }
    return found;
  }

  /**
   * Find first entity that matches predicate
   * @return Direction of entity
   * @return null when none found
   */
  public find(predicate: (e: Entity) => boolean): Direction | null {
    for (const dir of directionWithoutNone) {
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        return dir;
      }
    }
    return null;
  }

  /**
   * Find first entity that matches predicate
   * with a randomized search start direction
   * @return Direction of entity
   * @return null when none found
   */
  public findRand(predicate: (e: Entity) => boolean): Direction | null {
    const offset = randomIndex(directionWithoutNone as []);
    for (let i = 0; i < directionWithoutNone.length; i++) {
      const pointer = (i + offset) % directionWithoutNone.length;
      const dir = directionWithoutNone[pointer];
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        return dir;
      }
    }
    return null;
  }
}
