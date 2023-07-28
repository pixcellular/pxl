import {memoize} from './util/memoize';

export const v: (x: number, y: number) => Vector = memoize(
    (x: number, y: number) => {
      return new Vector(x, y);
    },
    (x, y) => {
      return `${x},${y}`;
    }
);

/**
 * Vector in two dimensional space
 */
export default class Vector {
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
