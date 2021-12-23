import {directionWithoutNone} from '../../src';
import randomIndex from '../../src/util/randomIndex';

it('should return all directions when picking random indices', () => {
  const expected = ['e', 'n', 'ne', 'nw', 's', 'se', 'sw', 'w'];
  const result = [];
  for (let i = 0; i < 1000; i++) {
    result.push(directionWithoutNone[randomIndex(directionWithoutNone as [])]);
  }
  const cardinalSorted = Array.from(new Set(result)).map(d => d.toString()).sort();
  expect(cardinalSorted).toStrictEqual(expected);
});
