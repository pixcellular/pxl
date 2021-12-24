import Grid from '../src/Grid';
import {SPACE} from '../src/Space';
import Vector from '../src/Vector';
import {WALL} from './stub/Wall';

it('should return empty vector when referring to an empty cell', () => {
  const grid = new Grid(5, 5, SPACE);
  expect(grid.get(new Vector(1, 1)).symbol).toBe(' ');
});

it('should return a newline separated map when calling grid.toString()', () => {
  const expectedMap = '###\n###\n###';
  const grid = new Grid(3, 3, WALL);
  expect(grid.toString()).toBe(expectedMap);
});

it('should return an map array when calling grid.toMap()', () => {
  const expectedMap = ['###', 'oo#', '###'];
  const grid = new Grid(3, 3, WALL);
  const l1 = new Vector(0, 1);
  grid.set(l1, {symbol: 'o', handled: false, props: {location: l1}});
  const l2 = new Vector(1, 1);
  grid.set(l2, {symbol: 'o', handled: false, props: {location: l2}});
  expect(grid.toMap()).toStrictEqual(expectedMap);
});
