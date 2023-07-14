import {Action, Behaviour, BehaviourGraph, EntityBuilderMap} from '../src';
import {EntityHandlerMap} from '../src';
import {EntityProps} from '../src';
import Direction, {E} from '../src/Direction';
import Entity from '../src/Entity';
import {SPACE} from '../src/Space';
import randomDirection from '../src/util/randomDirection';
import Vector from '../src/Vector';
import World from '../src/World';
import {MOVE, SLEEP, STOP} from './stub/Actions';
import {EntityStub} from './stub/EntityStub';
import EntityStubHandler from './stub/EntityStubHandler';
import {EntityStubProps} from './stub/EntityStubProps';
import {MovingBehaviour} from './stub/MovingBehaviour';
import SleepingBehaviour from './stub/SleepingBehaviour';
import SpaceHandler from './stub/SpaceHandler';
import {Wall} from './stub/Wall';
import WallHandler from './stub/WallHandler';

const handlers = new EntityHandlerMap();
handlers.add(' ', new SpaceHandler());
handlers.add('#', new WallHandler());

// Create rule graph:
const starting = new Behaviour<EntityStub>('starting', (action, entity, world) => {
  return new Action(MOVE.name, entity.props.dir);
});
const moving = new MovingBehaviour();
const sleeping = new SleepingBehaviour();
const stopping = new Behaviour('stop', () => {
  return new Action('');
});

const organismBehaviour = new BehaviourGraph<EntityStub>(starting, stopping);
// Add rules:
organismBehaviour.add(moving);
organismBehaviour.add(sleeping);
// Link rules by their results:
organismBehaviour.link(starting, MOVE, moving);
organismBehaviour.link(moving, SLEEP, sleeping);
organismBehaviour.link(moving, MOVE, sleeping);
organismBehaviour.link(sleeping, STOP,  stopping);

handlers.add('o', new EntityStubHandler(organismBehaviour));

it('should contain grid that matches plan', () => {
  class Org implements Entity {
    public props: EntityProps;
    public symbol: string;
    public direction: Direction;
    public handled;

    constructor(symbol: string, props: EntityProps) {
      this.props = props;
      this.symbol = symbol;
      this.direction = randomDirection();
      this.handled = false;
    }

  }

  const builders = new EntityBuilderMap();
  builders.add(' ', {build: () => SPACE});
  builders.add('#', {build: (props) => new Wall('#', props)});
  builders.add('o', {build: (props) => new Org('o', props)});
  const testPlan = ['#o', '# '];
  const world = new World({map: testPlan, entityProps: [], builders, handlers});
  expect(world.getGrid().toString()).toBe(testPlan.join('\n'));
});

it('should move test organism to east', () => {
  console.log('rules:\n', (handlers.get('o') as EntityStubHandler).rules.toString());
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const builders = new EntityBuilderMap();
  builders.add(' ', {build: () => SPACE});
  builders.add('o', {build: (p) => new EntityStub(p as EntityStubProps)});

  const map = ['o '];
  const expectedPlan = ' o';

  const world = new World({map, entityProps: [props], builders, handlers});

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});

it('should not handle entity twice', () => {
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const builders = new EntityBuilderMap();
  builders.add(' ', {build: () => SPACE});
  builders.add('o', {build: (p) => new EntityStub(p as EntityStubProps)});

  const startPlan = 'o  ';
  const expectedPlan = ' o ';

  const world = new World({map: [startPlan], entityProps: [props], builders, handlers});

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});

it('should not handle entity twice', () => {
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const builders = new EntityBuilderMap();
  builders.add(' ', {build: () => SPACE});
  builders.add('o', {build: (p) => new EntityStub(p as EntityStubProps)});

  const startPlan = 'o  ';
  const expectedPlan = ' o ';

  const world = new World({map: [startPlan], entityProps: [props], builders, handlers});

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});

it('does not need default entity handler and builder', () => {
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const builders = new EntityBuilderMap();
  builders.add('o', {build: (p) => new EntityStub(p as EntityStubProps)});

  const handlers = new EntityHandlerMap();
  handlers.add('o', new EntityStubHandler(organismBehaviour));

  const startPlan = 'o  ';
  const defaultEntity = SPACE;

  const world = new World({
    map: [startPlan],
    entityProps: [props],
    builders,
    handlers,
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
