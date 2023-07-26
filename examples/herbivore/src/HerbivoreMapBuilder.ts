import {isInRange, MapBuilder, MapEntityConfig, PerlinMapBuilder, PerlinMapBuilderConfig, WorldMap} from 'pixcellular';
import {HERBIVORE, PLANT, STONE} from './Symbols';

/**
 * Use a perlin noise generator
 * to determine how to populate our grid with entities
 */
export class HerbivoreMapBuilder implements MapBuilder<number> {
  private perlinBuilder: PerlinMapBuilder;

  constructor(width: number, height: number) {
    const wall: MapEntityConfig<number> = {
      symbol: STONE,
      match: (location, matrix) => isInRange(matrix.get(location), [0.6, 1]),
    };
    const plant: MapEntityConfig<number> = {
      symbol: PLANT,
      match: (location, matrix) => {
        const inRange = isInRange(matrix.get(location), [0.3, 1]);
        if (!inRange) {
          return false;
        }
        toggle = !toggle;
        return toggle;
      },
    };
    let toggle = false;
    const herbivore: MapEntityConfig<number> = {
      symbol: HERBIVORE,
      match: (location, matrix) => isInRange(matrix.get(location), [0, 0.1]),
    };
    const config: PerlinMapBuilderConfig = {
      defaultSymbol: ' ',
      entities: [
        wall,
        plant,
        herbivore
      ],
      scale: 0.25,
      shifter: () => Math.random() * 1000
    };
    this.perlinBuilder = new PerlinMapBuilder(
        width,
        height,
        config
    );
  }

  get symbols() {
    return this.perlinBuilder.symbols;
  }
  public build(): WorldMap {
    return this.perlinBuilder.build();
  }
}
