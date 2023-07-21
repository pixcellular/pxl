import {Behaviour, BehaviourGraph, E, EntityBuilderMap, Vector} from '../src';
import {SPACE} from '../src/Space';
import World from '../src/World';
import {MOVE, START, STOP} from './stub/Behaviours';
import {EntityStub} from './stub/EntityStub';
import {EntityStubProps} from './stub/EntityStubProps';
import {MovingBehaviour} from './stub/MovingBehaviour';
import SleepingBehaviour from './stub/SleepingBehaviour';
import {Wall} from './stub/Wall';

// Create rule graph:
const starting = new Behaviour<EntityStub>(START, () => MOVE, [MOVE]);
const moving = new MovingBehaviour();
const sleeping = new SleepingBehaviour();
const stopping = new Behaviour(STOP, () => {}, []);

const graph = new BehaviourGraph<EntityStub>(starting);
graph.add(moving);
graph.add(sleeping);
graph.add(stopping);

it('should contain grid that matches plan', () => {

  const builders = new EntityBuilderMap();
  builders.add(' ', {build: () => SPACE});
  builders.add('#', {build: (props) => new Wall('#', props)});
  builders.add('o', {build: (props) => new EntityStub(props as EntityStubProps, graph)});
  const testPlan = ['#o', '# '];

  const world = new World({map: testPlan, entityProps: [], builders});
  expect(world.getGrid().toString()).toBe(testPlan.join('\n'));
});

it('should move test organism to east', () => {
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const builders = new EntityBuilderMap();
  builders.add(' ', {build: () => SPACE});
  builders.add('o', {build: (p) => new EntityStub(p as EntityStubProps, graph)});

  const map = ['o '];
  const expectedPlan = ' o';

  const world = new World({map, entityProps: [props], builders});

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});

it('should not handle entity twice', () => {
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const builders = new EntityBuilderMap();
  builders.add(' ', {build: () => SPACE});
  builders.add('o', {build: (p) => new EntityStub(p as EntityStubProps, graph)});

  const startPlan = 'o  ';
  const expectedPlan = ' o ';

  const world = new World({map: [startPlan], entityProps: [props], builders});

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});

it('does not need default entity handler and builder', () => {
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const builders = new EntityBuilderMap();
  builders.add('o', {build: (p) => new EntityStub(p as EntityStubProps, graph)});

  const startPlan = 'o  ';
  const defaultEntity = SPACE;

  const world = new World({
    map: [startPlan],
    entityProps: [props],
    builders,
    defaultEntity
  });

  const space = world.getGrid().get(new Vector(1, 0));
  expect(space.props.location).toBe(undefined);

  let noExceptionThrown = true;
  try {
    world.turn();
  } catch (e) {
    noExceptionThrown = false;
  }
  expect(noExceptionThrown).toBeTruthy();

});
