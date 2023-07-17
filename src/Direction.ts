import Vector from './Vector';

/**
 * Cardinal direction pointing to one of the neighbouring cells
 */
export default class Direction extends Vector {

  private readonly cardinal: string;

  constructor(cardinal: string, x: number, y: number) {
    if (x > 1 || x < -1 || y > 1 || y < -1) {
      throw new Error('x and y should be between -1 and +1');
    }
    super(x, y);
    this.cardinal = cardinal;
  }

  public toString(): string {
    return this.cardinal;
  }

}

export const N = new Direction('N', 0, -1);
export const NE = new Direction('NE', 1, -1);
export const E = new Direction('E', 1, 0);
export const SE = new Direction('SE', 1, 1);
export const S = new Direction('S', 0, 1);
export const SW = new Direction('SW', -1, 1);
export const W = new Direction('W', -1, 0);
export const NW = new Direction('NW', -1, -1);

/**
 * Directs to current location
 */
export const CENTRE = new Direction('CENTRE', 0, 0);

/**
 * The nine cardinal and intercardinal directions representing all neighbouring cells
 */
export const cardinalDirections: readonly Direction[] = Object.freeze([N, NE, E, SE, S, SW, W, NW]);
