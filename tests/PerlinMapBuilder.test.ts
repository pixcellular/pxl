import PerlinMapBuilder from '../src/PerlinMapBuilder';
import {WorldMap} from '../src/WorldMatrix';

it('should build a map', () => {
  const width = 20;
  const height = 10;
  const wall = {
    symbol: '#',
    match: () => true,
    appearance: {lowerBound: 0.6, upperBound: 1}
  };
  const plant = {
    symbol: 'o',
    match: () => {
      toggle = !toggle;
      return toggle;
    },
    appearance: {lowerBound: 0.3, upperBound: 1}
  };
  let toggle = false;
  const herbivore = {
    symbol: '^',
    match: () => true,
    appearance: {lowerBound: 0, upperBound: 0.1}
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
