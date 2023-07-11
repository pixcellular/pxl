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
    if (!location) {
      throw new Error('Location not set');
    }
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
    if (this.world.getGrid().contains(target)) {
      return this.world.getGrid().get(target);
    }
    return null;
  }

  /**
   * Put entity at destination (= location + direction)
   * @return {Entity} Replaced target, or null
   */
  public put(dir: Direction, entity: Entity) {
    const target = this.location.plus(dir.toVector());
    return this.world.getGrid().put(target, entity);
  }

  /**
   * Find first direction that matches predicate
   * @return {Direction} of entity
   * @return {null} when none found
   */
  public findDir(predicate: (e: Entity) => boolean): Direction | null {
    for (const dir of directionWithoutNone) {
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        return dir;
      }
    }
    return null;
  }

  /**
   * Find all entity directions that match predicate
   * @return Direction[] of entities
   */
  public findDirs(predicate: (e: Entity) => boolean): Direction[] {
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
   * with a randomized search start direction
   * @return Direction of entity
   * @return null when none found
   */
  public findDirRand(predicate: (e: Entity) => boolean): Direction | null {
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

  /**
   * Remove entity from the grid
   * - Deletes location from props
   * - Replaces cell with default entity
   */
  public remove(dir: Direction): Entity | null {
    const target = this.location.plus(dir.toVector());
    return this.world.getGrid().remove(target);
  }

}
