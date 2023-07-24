import {MapBuilder} from './MapBuilder';
import {asArrays} from './Matrix';
import PerlinMatrix from './PerlinMatrix';
import Vector from './Vector';
import {WorldMap, WorldMatrix} from './WorldMatrix';

export type MapEntityConfig = {
  symbol: string;

  /**
   * In what range is the symbol found?
   * Lower bound and upperbound between 0 and 1.
   * What habitat does it populate within the mountain ranges of {@link PerlinMatrix}
   */
  range: [number, number]

  /**
   * Matcher determines if symbol is placed at location
   */
  match: (location: Vector, matrix: WorldMatrix) => boolean;
};

export type PerlinMapBuilderConfig = {
  defaultSymbol: string;

  /**
   * List of symbols, added in the order they appear in the array
   */
  entities: MapEntityConfig[],

  /**
   * Zoom level of {@link PerlinMatrix}
   * See {@link PerlinMapBuilder.defaultConfig} for a sensible default
   */
  scale: number
};
export default class PerlinMapBuilder implements MapBuilder {

  private static defaultConfig: PerlinMapBuilderConfig = {
    /**
     * List of symbols, added in the order they appear in the array
     */
    entities: [],
    scale: 0.25,
    defaultSymbol: ' '
  };

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
  }

  public build(): WorldMap {
    const matrix = new PerlinMatrix(this.width, this.height, {
      scale: this.config.scale
    }).asFractions();
    const map = new WorldMatrix(this.width, this.height, this.config.defaultSymbol);
    this.config.entities.forEach(symbol => {
      matrix.forEachCell((value, location) => {
        if (map.get(location) !== this.config.defaultSymbol) {
          return;
        }
        if (value < symbol.range[0] || value > symbol.range[1]) {
          return;
        }
        if (!symbol.match(location, map)) {
          return;
        }
        map.put(location, symbol.symbol);
      });
    });
    return asArrays(map).map(row => row.map(cell => cell).join(''));
  }
}
