import PerlinMapBuilder, {MapEntityConfig} from '../src/PerlinMapBuilder';
import {WorldMap} from '../src/WorldMatrix';

it('should build a map', () => {
  const width = 20;
  const height = 10;
  const wall: MapEntityConfig = {
    symbol: '#',
    match: () => true,
    range: [0.6, 1]
  };
  const plant: MapEntityConfig = {
    symbol: 'o',
    match: () => {
      toggle = !toggle;
      return toggle;
    },
    range: [0.3, 1]
  };
  let toggle = false;
  const herbivore: MapEntityConfig = {
    symbol: '^',
    match: () => true,
    range: [0, 0.1]
  };
  const config = {
    defaultSymbol: ' ',
    entities: [
      wall,
      plant,
      herbivore
    ],
    scale: 0.25
  };
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
