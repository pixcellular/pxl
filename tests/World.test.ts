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

const testSymbolHandler = new EntityHandlerMap();
testSymbolHandler.add(' ', new SpaceHandler());
testSymbolHandler.add('#', new WallHandler());

// Create rule graph:
const starting = new Behaviour<EntityStub>('starting', (action, entity, world) => {
  return new Action(MOVE.type, entity.props.dir);
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

testSymbolHandler.add('o', new EntityStubHandler(organismBehaviour));

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

  const entityFactory = new EntityBuilderMap();
  entityFactory.add(' ', {build: () => SPACE});
  entityFactory.add('#', {build: (props) => new Wall('#', props)});
  entityFactory.add('o', {build: (props) => new Org('o', props)});
  const testPlan = ['#o', '# '];
  const world = new World(testPlan, [], entityFactory, testSymbolHandler);
  expect(world.getGrid().toString()).toBe(testPlan.join('\n'));
});

it('should move test organism to east', () => {
  console.log('rules:\n', (testSymbolHandler.get('o') as EntityStubHandler).rules.toString());
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const entityFactory = new EntityBuilderMap();
  entityFactory.add(' ', {build: () => SPACE});
  entityFactory.add('o', {build: (p) => new EntityStub(p as EntityStubProps)});

  const startPlan = 'o ';
  const expectedPlan = ' o';

  const world = new World([startPlan], [props], entityFactory, testSymbolHandler);

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});

it('should not handle entity twice', () => {
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const entityFactory = new EntityBuilderMap();
  entityFactory.add(' ', {build: () => SPACE});
  entityFactory.add('o', {build: (p) => new EntityStub(p as EntityStubProps)});

  const startPlan = 'o  ';
  const expectedPlan = ' o ';

  const world = new World([startPlan], [props], entityFactory, testSymbolHandler);

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});
