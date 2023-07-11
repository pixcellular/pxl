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
  grid.put(l1, entity);
  const l2 = new Vector(1, 1);
  const entity2 = {symbol: 'o', handled: false, props: {location: l2}};
  grid.put(l2, entity2);
  expect(grid.toMap()).toStrictEqual(expectedMap);
});

it('should update entity.props.location when setting and moving an entity', () => {
  const grid = new Grid(3, 3, SPACE);
  const location1 = new Vector(0, 0);
  const location2 = new Vector(0, 1);
  const props = {name: 'entity1', location: location1} as EntityProps;
  const entity = {symbol: 'o', props} as Entity;

  grid.put(location1, entity);
  expect(grid.get(location1).props.location).toStrictEqual(location1);
  expect(grid.toString()).toBe('o  \n   \n   ');

  // Set entity at two locations:
  grid.put(location2, entity);
  expect(props.location).toStrictEqual(location2);
  expect(grid.toString()).toBe('   \no  \n   ');
});

it('should not set defaultEntity.props.location', () => {
  const grid = new Grid(1, 2, SPACE);
  const location = new Vector(0, 0);

  expect(grid.get(location).props.location).toBeUndefined();

  const location2 = new Vector(0, 1);
  const entity = {symbol: 'o', handled: false, props: {location: location2}} as Entity;
  grid.put(location, entity);

  expect(grid.get(location).props.location).toStrictEqual(location);
  expect(grid.get(location2)?.props?.location).toBeUndefined();
});

it('should set props.location when entity is not default', () => {
  const grid = new Grid(1, 2, SPACE);
  const location = new Vector(0, 0);

  expect(grid.get(location).props.location).toBeUndefined();

  const entity = {symbol: 'o', handled: false, props: {}} as Entity;
  grid.put(location, entity);

  expect(grid.get(location).props.location).toStrictEqual(location);
});

it('should overwrite when setting at a location populated by a non-default entity', () => {
  const grid = new Grid(1, 1, SPACE);
  const location1 = new Vector(0, 0);
  const entity1 = {symbol: 'o', handled: false, props: {location: location1}} as Entity;
  grid.put(location1, entity1);

  const location2 = new Vector(0, 1);
  const entity2 = {symbol: 'x', handled: false, props: {location: location2}} as Entity;
  const resultOverwrite = grid.put(location1, entity2) as Entity;

  expect(entity2.props.location).toStrictEqual(location1);
  expect(resultOverwrite.symbol).toBe('o');
  expect(resultOverwrite.props.location).toBeUndefined();
  expect(resultOverwrite.props.location).toBeUndefined();
});

it('should remove entity and delete location', () => {
  const grid = new Grid(1, 1, SPACE);
  const location = new Vector(0, 0);
  const entity = {symbol: 'o', handled: false, props: {location}} as Entity;
  grid.put(location, entity);
  expect(grid.get(location).props.location).toBe(location);

  grid.remove(location);

  expect(grid.get(location).props.location).toBeUndefined();
});
