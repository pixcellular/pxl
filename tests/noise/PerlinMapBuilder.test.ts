import {isInRange, MapEntityConfig} from '../../src';
import {WorldMap} from '../../src';
import PerlinMapBuilder, {PerlinMapBuilderConfig} from '../../src/noise/PerlinMapBuilder';

/**
 * Is value between range
 * @param value
 * @param range
 */
it('should build a map', () => {
  const width = 20;
  const height = 10;
  const wall: MapEntityConfig<number> = {
    symbol: '#',
    match: (location, matrix) => isInRange(matrix.get(location), [0.6, 1]),
  };
  const plant: MapEntityConfig<number> = {
    symbol: 'o',
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
    symbol: '^',
    match: (location, matrix) => isInRange(matrix.get(location), [0, 0.1]),
  };
  const config = {
    defaultSymbol: ' ',
    entities: [
      wall,
      plant,
      herbivore
    ],
    scale: 0.25
  } as PerlinMapBuilderConfig;
  const builder = new PerlinMapBuilder(
      width,
      height,
      config
  );

  const received = builder.build();

  const expected: WorldMap = [
    ' o ###o o o o  o ###',
    'o ##o o o o## o o o ',
    'o### o o ####o      ',
    'o#### o  o## o  ^   ',
    'o ###o   o o o   o o',
    ' o###   o ##o o o #o',
    ' o## o   #####o ####',
    'o## o o o### o #####',
    'o# o o o o# o o#####',
    ' o o o o o# o ##o o '
  ];
  expect(received).toStrictEqual(expected);
});
