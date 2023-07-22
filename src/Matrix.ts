import {V} from './Vector';

export interface Matrix<T> {

  getWidth(): number;

  getHeight(): number;

  getAll(): T[];

  forEachCell(handler: (cell: T, location: V) => void): void;

  remove(location: V): T | null;

  put(location: V, cell: T): T | null;

  get(vector: V): T;

  contains(location: V): boolean;
}

export function contains<T>(location: V, matrix: Matrix<T>): boolean {
  return location.x >= 0 && location.x < matrix.getWidth() &&
      location.y >= 0 && location.y < matrix.getHeight();
}

export function getCellIndex<T>(location: V, matrix: Matrix<T>): number {
  return location.x + (matrix.getWidth() * location.y);
}

export function asArrays<T>(matrix: Matrix<T>): T[][] {
  const result: T[][] = new Array(matrix.getHeight());
  for (let hi = 0; hi < matrix.getHeight(); hi++) {
    result[hi] = new Array(matrix.getWidth()).fill(0);
  }
  for (let y = 0; y < matrix.getHeight(); y++) {
    for (let x = 0; x < matrix.getWidth(); x++) {
      result[y][x] = matrix.get({x, y});
    }
  }
  return result;
}

export function forEachCell<T>(matrix: Matrix<T>, handle: (value: T, location: V) => void) {
  for (let y = 0; y < matrix.getHeight(); y++) {
    for (let x = 0; x < matrix.getWidth(); x++) {
      handle(matrix.get({x, y}), {x, y});
    }
  }
}
