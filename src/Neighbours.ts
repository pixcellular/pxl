import Direction, {cardinalDirections} from './Direction';
import {Matrix} from './Matrix';
import randomIndex from './util/randomIndex';
import Vector from './Vector';
import View from './View';

/**
 * A limited perspective of 1 cell in all directions
 */
export default class Neighbours<T> implements View<T> {
  private matrix: Matrix<T>;
  private centre: Vector;

  constructor(grid: Matrix<T>, centre: Vector) {
    if (!centre) {
      throw new Error('Location not set');
    }
    this.matrix = grid;
    this.centre = centre;
  }

  public getCentre(): Vector {
    return this.centre;
  }

  public get(dir: Direction): T | null {
    const target = this.centre.plus(dir);
    if (this.matrix.contains(target)) {
      return this.matrix.get(target);
    }
    return null;
  }

  public put(dir: Direction, entity: T) {
    const target = this.centre.plus(dir);
    return this.matrix.put(target, entity);
  }

  public findDir(predicate: (e: T) => boolean): Direction | null {
    for (const dir of cardinalDirections) {
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        return dir;
      }
    }
    return null;
  }

  public findDirs(predicate: (e: T) => boolean): Direction[] {
    const found = [];
    for (const dir of cardinalDirections) {
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        found.push(dir);
      }
    }
    return found;
  }

  public findDirRand(predicate: (e: T) => boolean): Direction | null {
    const offset = randomIndex(cardinalDirections as []);
    for (let i = 0; i < cardinalDirections.length; i++) {
      const pointer = (i + offset) % cardinalDirections.length;
      const dir = cardinalDirections[pointer];
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        return dir;
      }
    }
    return null;
  }

  public remove(dir: Direction): T | null {
    const target = this.centre.plus(dir);
    return this.matrix.remove(target);
  }

}
