import ImprovedNoise from "./Perlin";

export type PerlinMatrixConfig = {
  seeder: () => number,
  shift: number,
  scale: number
}

export default class PerlinMatrix {
  public static range = [-Math.sqrt(2) / 2, Math.sqrt(2) / 2]
  private width: number;
  private height: number;
  private seeder: () => number;
  private shift: number;
  private scale: number;

  private static defaultConfig: PerlinMatrixConfig = {
    scale: 1,
    seeder: () => Math.PI,
    shift: 0
  }

  constructor(
      width: number,
      height: number,
      config?: Partial<PerlinMatrixConfig>
  ) {
    this.width = width;
    this.height = height;
    const finalConfig: PerlinMatrixConfig = Object.assign({}, PerlinMatrix.defaultConfig, config);
    this.seeder = finalConfig.seeder;
    this.shift = finalConfig.shift;
    this.scale = finalConfig.scale;
  }

  public asArrays(): number[][] {
    return this.createMatrix();
  }

  /**
   * From ~[-0.7, ~+0.7] to [0,1]
   */
  public toFractions(): number[][] {
    const perlinRange = PerlinMatrix.range[1];
    const perlinMatrix = this.createMatrix();
    return mapEachCell<number, number>(
        perlinMatrix,
        (_, value) => (value + perlinRange) / (perlinRange * 2)
    );
  }

  private createMatrix() {
    const seed = this.seeder();
    const matrix = [];
    for (let hi = 0; hi < this.height; hi++) {
      matrix.push(new Array(this.width).fill(0));
    }
    for (let wi = 0; wi < this.width; wi++) {
      for (let hi = 0; hi < this.height; hi++) {
        const x = wi + seed;
        const y = hi + seed;
        const scaledY = y * this.scale;
        const scaledX = x * this.scale;
        const shiftedX = scaledX + this.shift;
        const shiftedY = scaledY + this.shift;
        matrix[hi][wi] = ImprovedNoise.noise(shiftedX, shiftedY, 0)
      }
    }
    return matrix;
  }
}

export function flatten<T>(matrix: T[][]): T[] {
  return matrix.reduce((memo, it) => {
    return memo.concat(it)
  }, []);
}

export function mapEachCell<T, U>(matrix: T[][], handle: (location: Vector, value: T) => U): U[][] {
  const result = JSON.parse(JSON.stringify(matrix));
  for (let hi = 0; hi < result.length; hi++) {
    for (let wi = 0; wi < result[0].length; wi++) {
      result[hi][wi] = handle({x: wi, y: hi}, result[hi][wi])
    }
  }
  return result;
}

export type Vector = {
  x: number;
  y: number;
}