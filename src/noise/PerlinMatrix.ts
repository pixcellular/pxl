import {contains, forEachCell, getCellIndex, Matrix} from '../Matrix';
import ImprovedNoise from './Perlin';
import Vector, {v} from '../Vector';

export type PerlinMatrixConfig = {

  shift: number,

  /**
   * Zoom level
   * See {@link PerlinMapBuilder.defaultConfig} for a sensible default
   */
  scale: number,

  /**
   * Use floating seed to avoid integers
   * Perlin noise should be generated using floats instead of integers
   * Default seed is Math.PI
   */
  useSeed?: boolean
};

/**
 * Build a map using [Perlin Noise]{@link https://en.wikipedia.org/wiki/Perlin_noise}
 */
export default class PerlinMatrix implements Matrix<number> {
  public static range = [-Math.sqrt(2) / 2, Math.sqrt(2) / 2];

  public static from(old: PerlinMatrix): PerlinMatrix {
    return new PerlinMatrix(old.width, old.height, old.config);
  }

  private static defaultConfig: PerlinMatrixConfig = {
    scale: 1,
    shift: 0,
    useSeed: true
  };

  private width: number;
  private height: number;
  private seed: number;
  private cells: number[];
  private config: PerlinMatrixConfig;

  constructor(
      width: number,
      height: number,
      config?: Partial<PerlinMatrixConfig>
  ) {
    this.width = width;
    this.height = height;
    this.config = Object.assign({}, PerlinMatrix.defaultConfig, config);
    this.seed = this.config.useSeed
        ? Math.PI
        : 0;
    this.cells = this.createMatrix();
  }

  /**
   * Convert perlin range of ~[-0.7, +0.7] to fractions [0, 1]
   */
  public asFractions(): PerlinMatrix {
    const perlinRange = PerlinMatrix.range[1];
    return mapMatrix(
        this,
        (_, value) => (value + perlinRange) / (perlinRange * 2)
    );
  }

  public forEachCell(handler: (cell: number, location: Vector) => void): void {
    forEachCell<number>(this, handler);
  }

  public get(vector: Vector): number {
    return this.cells[getCellIndex(vector, this)];
  }

  public getAll(): number[] {
    return this.cells;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWidth(): number {
    return this.width;
  }

  public put(location: Vector, cell: number): number {
    const old = this.get(location);
    this.cells[getCellIndex(location, this)] = cell;
    return old;
  }

  public remove(location: Vector): number | null {
    throw new Error('Not implemented');
  }

  public contains(location: Vector): boolean {
    return contains(location, this);
  }

  private createMatrix(): number[] {
    const matrix: number[] = [];
    for (let hi = 0; hi < this.height; hi++) {
      for (let wi = 0; wi < this.width; wi++) {
        const x = wi + this.seed;
        const y = hi + this.seed;
        const scaledY = y * this.config.scale;
        const scaledX = x * this.config.scale;
        const shiftedX = scaledX + this.config.shift;
        const shiftedY = scaledY + this.config.shift;
        if (Number.isInteger(shiftedY) && Number.isInteger(shiftedY)) {
          throw new Error(`Use floats instead of integers: x=${shiftedX}; y=${shiftedY}`);
        }
        matrix.push(ImprovedNoise.noise(shiftedX, shiftedY, 0));
      }
    }
    return matrix;
  }
}

export function mapMatrix(
    matrix: PerlinMatrix,
    handle: (location: Vector, value: number) => number
): PerlinMatrix {
  const result = PerlinMatrix.from(matrix);
  for (let y = 0; y < matrix.getHeight(); y++) {
    for (let x = 0; x < matrix.getWidth(); x++) {
      const location = v(x, y);
      result.put(location, handle(location, matrix.get(location)));
    }
  }
  return result;
}
