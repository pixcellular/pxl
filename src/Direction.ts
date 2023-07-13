import Vector from './Vector';

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

export const N = new Direction('n', 0, -1);
export const NE = new Direction('ne', 1, -1);
export const E = new Direction('e', 1, 0);
export const SE = new Direction('se', 1, 1);
export const S = new Direction('s', 0, 1);
export const SW = new Direction('sw', -1, 1);
export const W = new Direction('w', -1, 0);
export const NW = new Direction('nw', -1, -1);
export const ZERO = new Direction('zero', 0, 0);

/**
 * Lower case cardinal direction to Direction
 */
export const cardinalToDirection = Object.freeze({n: N, ne: NE, e: E, se: SE, s: S, sw: SW, w: W, nw: NW, zero: ZERO});

/**
 * All lower case cardinal directions as string values
 */
export const cardinalDirections: readonly string[] = Object.freeze(Object.keys(cardinalToDirection));

/**
 * All Directions
 */
export const direction: readonly Direction[] = Object.freeze(Object.values(cardinalToDirection));

/**
 * All Directions without ZERO
 */
export const directionNotZero: readonly Direction[] = direction.slice(0, -1);
