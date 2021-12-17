import Grid from '../src/Grid';
import Vector from '../src/Vector';

it('should return empty vector when referring to an empty cell', () => {
  const grid = new Grid(5, 5);
  expect(grid.get(new Vector(1, 1))).toBeFalsy();
});
