import Entity from '../src/Entity';
import Grid from '../src/Grid';
import {SPACE} from '../src/Space';
import Vector from '../src/Vector';
import {Wall} from './stub/Wall';

it('should return empty vector when referring to an empty cell', () => {
  const grid = new Grid(5, 5, SPACE);
  expect(grid.get(new Vector(1, 1)).symbol).toBe(' ');
});

it('should return a newline separated map when calling grid.toString()', () => {
  const expectedMap = '###\n###\n###';
  const grid = new Grid(3, 3, new Wall('#', {}));
  expect(grid.toString()).toBe(expectedMap);
});

it('should return an map array when calling grid.toMap()', () => {
  const expectedMap = ['###', 'oo#', '###'];
  const grid = new Grid(3, 3, new Wall('#', {}));
  const l1 = new Vector(0, 1);
  grid.put(l1, {symbol: 'o', handled: false, props: {location: l1}});
  const l2 = new Vector(1, 1);
  grid.put(l2, {symbol: 'o', handled: false, props: {location: l2}});
  expect(grid.toMap()).toStrictEqual(expectedMap);
});

it('should update entity.props.location when moving an entity', () => {
  const grid = new Grid(3, 3, SPACE);
  const location = new Vector(0, 0);
  const newLocation = new Vector(0, 1);
  const entity = {symbol: 'o', handled: false, props: {}} as Entity;
  grid.put(location, entity);
  expect(grid.get(location).props.location).toStrictEqual(location);
  grid.put(newLocation, entity);
  expect(grid.get(newLocation).props.location).toStrictEqual(newLocation);
});

it('should not set defaultEntity.props.location', () => {
  const grid = new Grid(1, 2, SPACE);
  const location = new Vector(0, 0);
  expect(grid.get(location).props.location).toBeUndefined();

  const entity = {symbol: 'o', handled: false, props: {}} as Entity;
  grid.put(location, entity);
  expect(grid.get(location).props.location).toStrictEqual(location);

  const newLocation = new Vector(0, 1);
  grid.put(newLocation, entity);
  expect(grid.get(location).props.location).toBeUndefined();
});
