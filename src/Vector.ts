/**
 * Vector as plain XY-coordinates
 */
export type V = {
  x: number;
  y: number;
};

/**
 * Vector in two dimensional space
 */
export default class Vector  implements V {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public plus(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  public isEqual(other: Vector) {
    return this.x === other?.x && this.y === other?.y;
  }

}
