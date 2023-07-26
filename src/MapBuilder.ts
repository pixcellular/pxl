import {Matrix} from './Matrix';
import Vector from './Vector';
import {WorldMap} from './WorldMatrix';

export type MapEntityConfig<T> = {
  symbol: string;

  /**
   * Determines if symbol is placed at location
   *
   * In what range is the symbol found?
   */
  match: (location: Vector, matrix: Matrix<T>) => boolean;
};
export interface MapBuilder<T> {
  /**
   * Configuration of symbols used on our map
   */
  symbols: Array<MapEntityConfig<T>>;

  /**
   *
   */
  build(): WorldMap;
}
