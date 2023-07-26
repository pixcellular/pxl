import {MapBuilder, MapEntityConfig} from './MapBuilder';
import {asArrays} from './Matrix';
import PerlinMatrix, {PerlinMatrixConfig} from './PerlinMatrix';
import {WorldMap, WorldMatrix} from './WorldMatrix';

export type PerlinMapBuilderConfig = Omit<PerlinMatrixConfig, 'shift'> & {
  defaultSymbol: string;

  /**
   * List of symbols, added in the order they appear in the array
   */
  entities: Array<MapEntityConfig<number>>,

  /**
   * Shift on infinite Perlin noise plane to create a new map on every build
   */
  shifter: () => number;
};

export default class PerlinMapBuilder implements MapBuilder<number> {

  private static defaultConfig: PerlinMapBuilderConfig = {
    /**
     * List of symbols, added in the order they appear in the array
     */
    entities: [],
    scale: 0.25,
    defaultSymbol: ' ',
    shifter: () => 0,
    useSeed: true
  };

  private _symbols = new Array<MapEntityConfig<number>>();
  private width: number;
  private height: number;
  private config: PerlinMapBuilderConfig;

  constructor(
      width: number,
      height: number,
      config: Partial<PerlinMapBuilderConfig>
  ) {
    this.width = width;
    this.height = height;
    this.config = Object.assign({}, PerlinMapBuilder.defaultConfig, config);
    this._symbols = this.config.entities;
  }

  public build(): WorldMap {
    const matrixConfig: PerlinMatrixConfig = {
      scale: this.config.scale,
      shift: this.config.shifter(),
      useSeed: this.config.useSeed
    };
    const matrix = new PerlinMatrix(this.width, this.height, matrixConfig).asFractions();
    const map = new WorldMatrix(this.width, this.height, this.config.defaultSymbol);
    this._symbols.forEach(symbol => {
      matrix.forEachCell((value, location) => {
        if (map.get(location) !== this.config.defaultSymbol) {
          return;
        }
        if (!symbol.match(location, matrix)) {
          return;
        }
        map.put(location, symbol.symbol);
      });
    });
    return asArrays(map).map(row => row.map(cell => cell).join(''));
  }
  get symbols(): Array<MapEntityConfig<number>> {
    return this._symbols;
  }

  set symbols(value: Array<MapEntityConfig<number>>) {
    this._symbols = value;
  }

}
