import Entity, {EntityWithLocation} from './Entity';
import {EntityProps} from './EntityProps';
import {contains, getCellIndex, Matrix} from './Matrix';
import {SPACE} from './Space';
import Vector from './Vector';

/**
 * Two-dimensional map of square cells with entities
 */
export default class Grid implements Matrix<Entity> {
  private readonly cells: Entity[];
  private readonly width: number;
  private readonly height: number;
  private readonly defaultEntity: Entity;

  /**
   * @param {number} width - Width of grid
   * @param {number} height - Height of grid
   * @param {Entity} [defaultEntity] - Locationless {@link Entity} used to fill empty cells
   */
  constructor(width: number, height: number, defaultEntity: Entity = SPACE) {
    this.cells = new Array(width * height);
    this.width = width;
    this.height = height;
    this.defaultEntity = defaultEntity;
    this.forEach((_, x, y) => this.put(new Vector(x, y), defaultEntity));
  }

  /**
   * Does grid contain location?
   */
  public contains(location: Vector): boolean {
    return contains(location, this);
  }

  /**
   * Get cell by vector
   */
  public get(vector: Vector): Entity {
    return this.cells[vector.x + vector.y * this.width];
  }

  /**
   * Set entity at location
   *  - assign entity to new location
   *  - when non-default entity:
   *    update props.location
   *  - when location occupied by a non-default entity:
   *    delete location of occupying entity
   *  @return {Entity} - Possible previous entity at the specified location, or null if default entity
   */
  public put(location: Vector, entity: Entity): Entity | null {
    if (!location) {
      throw new Error('No location');
    }
    const newIndex = getCellIndex(location, this);
    const entityToOverwrite = this.cells[newIndex];
    this.cells[newIndex] = entity;

    // Set location:
    if (this.isNonDefault(entity)) {
      const oldLocation = entity.props.location;
      entity.props.location = location;
      if (oldLocation && !oldLocation.isEqual(location)) {
        const oldIndex = getCellIndex(oldLocation, this);
        this.cells[oldIndex] = this.defaultEntity;
      }
    }

    if (this.isNonDefault(entityToOverwrite)) {
      // Remove from grid and return:
      delete (entityToOverwrite.props as EntityProps).location;
      return entityToOverwrite;
    }
    return null;
  }

  /**
   * Remove entity from the board
   * - Deletes location from props
   * - Replaces cell with default entity
   */
  public remove(location: Vector): Entity | null {
    const index = getCellIndex(location, this);
    const entity = this.cells[index];
    this.cells[index] = this.defaultEntity;
    if (entity.props.location) {
      delete entity.props.location;
      return entity;
    }
    return null;
  }

  /**
   * Loop through entities by their location
   * from left to right, from top to bottom
   */
  public forEachCell(handler: (entity: Entity, location: Vector) => void) {
    this.forEach((entity: Entity, x: number, y: number) => {
      if (entity != null) {
        const location = new Vector(x, y);
        handler(entity, location);
      }
    });
  }

  /**
   * Get all entities
   */
  public getAll(): Entity[] {
    return this.cells;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWidth(): number {
    return this.width;
  }

  /**
   * @return string[] map in which each character
   * represents the symbol of an entity on the grid
   */
  public toMap(): string[] {
    const result: string[] = [];
    this.forEach((entity, x, y) => {
      if (!result[y]) {
        result[y] = '';
      }
      result[y] += entity.symbol;
    });
    return result;
  }

  /**
   * @return string newline seperated map in which each character
   * represents the symbol of an entity on the grid
   */
  public toString(): string {
    return this.toMap().join('\n');
  }

  /**
   * Mark all entities as unhandled
   */
  public  unhandle(): void {
    this.forEach((entity: Entity) => {
      entity.handled = false;
    });
  }

  /**
   * Loop through cells, from left to right, from top to bottom
   */
  private forEach(handler: (e: Entity, x: number, y: number) => void): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const entity = this.get(new Vector(x, y));
        handler(entity, x, y);
      }
    }
  }

  /**
   * Default has no location:
   */
  private isNonDefault(entity: Entity): entity is EntityWithLocation {
    return !!entity?.symbol && entity.symbol !== this.defaultEntity.symbol;
  }

}
