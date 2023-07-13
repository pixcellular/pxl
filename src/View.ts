import Entity from './Entity';
import Vector from './Vector';

/**
 * View on a grid
 * Directions point to locations on the grid relative to the centre of the view
 */
export default interface View {
  /**
   * Centre of the view, location ZERO, 0,0
   */
  getCentre(): Vector;

  /**
   * Get an entity at destination
   * @return Entity at destination, or null when direction outside of grid
   */
  get(direction: Vector): Entity | null;

  /**
   * Put entity at destination (= location + direction)
   * @return {Entity} Replaced target, or null
   */
  put(direction: Vector, entity: Entity): Entity | null;

  /**
   * Remove entity from the grid
   * - Deletes location from props
   * - Replaces cell with default entity
   * @return {Entity} deleted entity, or null when {@link defaultEntity}
   */
  remove(direction: Vector): Entity | null;

  /**
   * Find first location that matches predicate
   * @return {Vector} location of entity
   * @return {null} when no entities found
   */
  findDir(predicate: (e: Entity) => boolean): Vector | null;

  /**
   * Find entity that matches predicate
   * or when multiple match, pick one randomly
   * @return {Vector} location of random entity
   * @return null when {@link zero} found
   */
  findDirRand(predicate: (e: Entity) => boolean): Vector | null;

  /**
   * Find all entity directions that match predicate
   * @return {Vector[]} locations of entities
   */
  findDirs(predicate: (e: Entity) => boolean): Vector[];
}
