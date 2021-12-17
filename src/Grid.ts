import Entity from './Entity';
import Vector from './Vector';

/**
 * Two dimensional map of square cells with entities
 */
export default class Grid {
  private readonly cells: Entity[];
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number) {
    this.cells = new Array(width * height);
    this.width = width;
    this.height = height;
  }

  public isInside(vector: Vector) {
    return vector.x >= 0 && vector.x < this.width &&
      vector.y >= 0 && vector.y < this.height;
  }

  /**
   * Get cell by vector
   */
  public get(vector: Vector) {
    return this.cells[vector.x + vector.y * this.width];
  }

  /**
   * Put entity on location
   */
  public set(location: Vector, entity: Entity) {
    this.cells[location.x + (this.width * location.y)] = entity;
  }

  public forEachCell(handler: (entity: Entity, location: Vector) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const entity = this.cells[x + y * this.width];
        if (entity != null) {
          const location = new Vector(x, y);
          handler(entity, location);
        }
      }
    }
  }

  public getHeight() {
    return this.height;
  }

  public getWidth() {
    return this.width;
  }

  public toString() {
    let output = '';
    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        const element = this.get(new Vector(x, y));
        output += element.symbol;
      }
      if (y < this.getHeight() - 1) {
        output += '\n';
      }
    }
    return output;
  }

}
