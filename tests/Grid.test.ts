import {EntityProps} from '../src';
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
  const entity = {symbol: 'o', handled: false, props: {location: l1}};
  grid.set(l1, entity);
  const l2 = new Vector(1, 1);
  const entity2 = {symbol: 'o', handled: false, props: {location: l2}};
  grid.set(l2, entity2);
  expect(grid.toMap()).toStrictEqual(expectedMap);
});

it('should update entity.props.location when setting and moving an entity', () => {
  const grid = new Grid(3, 3, SPACE);
  const location1 = new Vector(0, 0);
  const location2 = new Vector(0, 1);
  const props = {} as EntityProps;
  const entity = {symbol: 'o', handled: false, props} as Entity;

  grid.set(location1, entity);
  expect(grid.get(location1).props.location).toStrictEqual(location1);

  grid.set(location2, entity);
  expect(props.location).toStrictEqual(location2);

  grid.move(location2, location1);
  expect(props.location).toStrictEqual(location1);
});

it('should not set defaultEntity.props.location', () => {
  const grid = new Grid(1, 2, SPACE);
  const location = new Vector(0, 0);
  expect(grid.get(location).props.location).toBeUndefined();

  const entity = {symbol: 'o', handled: false, props: {}} as Entity;
  grid.set(location, entity);
  expect(grid.get(location).props.location).toStrictEqual(location);

  const newLocation = new Vector(0, 1);
  grid.move(location, newLocation);
  expect(grid.get(location).props.location).toBeUndefined();
});
