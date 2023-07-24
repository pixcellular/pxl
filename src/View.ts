import Vector from './Vector';

/**
 * View on a grid of the centre cell plus its surrounding cells
 * Directions point to locations on the grid relative to the centre of the view
 *
 * location = centre + direction
 *
 * @typeParam T Entity type ({@link Entity} or any other type) that populates the cells
 */
export default interface View<T> {

  /**
   * Get the location of CENTRE (0, 0) within the matrix
   */
  getCentre(): Vector;

  /**
   * Get entity
   *
   * @return T, or null when location outside of grid
   */
  get(direction: Vector): T | null;

  /**
   * Put entity
   *
   * @return T replaced, or null
   */
  put(direction: Vector, entity: T): T | null;

  /**
   * Remove entity from the grid
   * - Deletes location from props
   * - Replace entity with default
   *
   * @return T deleted, or null
   */
  remove(direction: Vector): T | null;

  /**
   * Find direction to first matching entity
   * searching in order of {@link cardinalDirections}
   *
   * @return {Vector} direction to T, or null when none found
   */
  findDir(predicate: (e: T) => boolean): Vector | null;

  /**
   * Find the direction to a randomly picked entity that matches the predicate
   *
   * @return {Vector} direction to entity, or null when none found
   */
  findDirRand(predicate: (e: T) => boolean): Vector | null;

  /**
   * Find all matching directions
   *
   * @return {Vector[]} directions to entities
   */
  findDirs(predicate: (e: T) => boolean): Vector[];
}
