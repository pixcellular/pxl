import {cardinalDirections} from '../../src';
import randomIndex from '../../src/util/randomIndex';

it('should return all directions when picking random indices', () => {
  const expected = ['E', 'N', 'NE', 'NW', 'S', 'SE', 'SW', 'W'];
  const result = [];
  for (let i = 0; i < 1000; i++) {
    result.push(cardinalDirections[randomIndex(cardinalDirections)]);
  }
  const cardinalSorted = Array.from(new Set(result)).map(d => d.toString()).sort();
  expect(cardinalSorted).toStrictEqual(expected);
});
