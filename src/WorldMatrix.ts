import {contains, forEachCell, getCellIndex, Matrix} from './Matrix';
import Vector from './Vector';

export type WorldMap = string[];

/**
 * Matrix with symbols
 */
export class WorldMatrix implements Matrix<string> {

  private cells: string[];

  private width: number;
  private height: number;
  private defaultSymbol: string;

  constructor(
      width: number,
      height: number,
      defaultSymbol: string
  ) {
    this.width = width;
    this.height = height;
    this.defaultSymbol = defaultSymbol;
    this.cells = this.createMatrix();
  }
  public get(vector: Vector): string {
    return this.cells[getCellIndex(vector, this)];
  }

  public getAll(): string[] {
    return this.cells;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWidth(): number {
    return this.width;
  }

  public put(location: Vector, cell: string): string {
    const old = this.get(location);
    this.cells[getCellIndex(location, this)] = cell;
    return old;
  }

  public remove(location: Vector): string | null {
    throw new Error('Not implemented');
  }

  public contains(location: Vector): boolean {
    return contains(location, this);
  }

  public forEachCell(handler: (cell: string, location: Vector) => void): void {
    forEachCell<string>(this, handler);
  }

  private createMatrix() {
    return new Array(this.height * this.width).fill(this.defaultSymbol);
  }
}
