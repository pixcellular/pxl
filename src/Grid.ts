import Entity from './Entity';
import Vector from './Vector';

/**
 * Two dimensional map of square cells with entities
 */
export default class Grid {
  private readonly cells: Entity[];
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number, defaultEntity: Entity) {
    this.cells = new Array(width * height);
    this.width = width;
    this.height = height;
    this.forEach((_, x, y) => this.set(new Vector(x, y), defaultEntity));
  }

  public isInside(vector: Vector): boolean {
    return vector.x >= 0 && vector.x < this.width &&
      vector.y >= 0 && vector.y < this.height;
  }

  /**
   * Get cell by vector
   */
  public get(vector: Vector): Entity {
    return this.cells[vector.x + vector.y * this.width];
  }

  /**
   * Put entity on location
   */
  public set(location: Vector, entity: Entity) {
    this.cells[location.x + (this.width * location.y)] = entity;
  }

  public forEachCell(handler: (entity: Entity, location: Vector) => void) {
    this.forEach((entity: Entity, x: number, y: number) => {
      if (entity != null) {
        const location = new Vector(x, y);
        handler(entity, location);
      }
    });
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
  public unhandle(): void {
    this.forEach((entity: Entity) => {
      entity.handled = false;
    });
  }

  private forEach(handler: (e: Entity, x: number, y: number) => void): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const entity = this.get(new Vector(x, y));
        handler(entity, x, y);
      }
    }
  }
}
