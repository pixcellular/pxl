import Entity from './Entity';
import Vector from './Vector';

/**
 * View on a grid of the centre cell plus its surrounding cells
 * Directions point to locations on the grid relative to the centre of the view
 *
 * location = centre + direction
 */
export default interface View {

  /**
   * Centre of the view, location CENTRE, 0,0
   */
  getCentre(): Vector;

  /**
   * Get entity
   *
   * @return {Entity}, or null when location outside of grid
   */
  get(direction: Vector): Entity | null;

  /**
   * Put entity
   *
   * @return {Entity} replaced, or null
   */
  put(direction: Vector, entity: Entity): Entity | null;

  /**
   * Remove entity from the grid
   * - Deletes location from props
   * - Replaces cell with default entity
   *
   * @return {Entity} deleted, or null when {@link defaultEntity}
   */
  remove(direction: Vector): Entity | null;

  /**
   * Find direction to first matching entity
   * searching in order of {@link cardinalDirections}
   *
   * @return {Vector} direction to entity, or null when no entities found
   */
  findDir(predicate: (e: Entity) => boolean): Vector | null;

  /**
   * Find the direction to a randomly picked matching entity
   *
   * @return {Vector} direction to entity, or null when no entities found
   */
  findDirRand(predicate: (e: Entity) => boolean): Vector | null;

  /**
   * Find all matching directions
   *
   * @return {Vector[]} directions to entities
   */
  findDirs(predicate: (e: Entity) => boolean): Vector[];
}
