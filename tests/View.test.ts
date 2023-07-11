import {Behaviour, BehaviourGraph, EntityProps, N, NONE} from '../src';
import {EntityBuilderMap} from '../src';
import {EntityHandlerMap} from '../src';
import Action from '../src/Action';
import {SPACE} from '../src/Space';
import Vector from '../src/Vector';
import View from '../src/View';
import World from '../src/World';
import {EntityStub} from './stub/EntityStub';
import EntityStubHandler from './stub/EntityStubHandler';
import {EntityStubProps} from './stub/EntityStubProps';
import SpaceHandler from './stub/SpaceHandler';
import {Wall} from './stub/Wall';
import WallHandler from './stub/WallHandler';

const entityFactory = new EntityBuilderMap();
entityFactory.add(' ', {build: () => SPACE});
entityFactory.add('#', {build: (props) => new Wall('#', props)});
entityFactory.add('o', {build: (props) => new EntityStub(props as EntityStubProps)});

const testSymbolHandler = new EntityHandlerMap();
testSymbolHandler.add(' ', new SpaceHandler());
testSymbolHandler.add('#', new WallHandler());

const entryRule = new Behaviour('entry', (action: Action) => {
  return action;
});
const stopRule = new Behaviour('stop', (action: Action) => {
  return action;
});
const behaviourGraph = new BehaviourGraph(entryRule, stopRule);

testSymbolHandler.add('o',
  new EntityStubHandler(
    behaviourGraph
  )
);

it('should contain all neighbours with char', () => {
  const propsOfEntities: EntityProps[] = [];
  const testPlan = ['###', '#  ', '#  '];

  const world = new World(testPlan, propsOfEntities, entityFactory, testSymbolHandler);

  const view = new View(world, new Vector(1, 1));
  const allWall = view.findDirs(e => e.symbol === '#');
  const expectedDirs: string[] = [
    'n',
    'ne',
    'sw',
    'w',
    'nw'
  ];
  expect(allWall.map(w => w.toString())).toStrictEqual(expectedDirs);
});

it('should not find itself', () => {
  const propsOfEntities: EntityProps[] = [];
  const testPlan = ['o  ', ' o ', '  o'];

  const world = new World(testPlan, propsOfEntities, entityFactory, testSymbolHandler);

  const view = new View(world, new Vector(1, 1));
  const allO = view.findDirs(e => e.symbol === 'o');
  const expectedDirs: string[] = ['se', 'nw'];
  expect(expectedDirs).toStrictEqual(allO.map(w => w.toString()));
});

it('should update props.location on set', () => {
  const props = {location: new Vector(1, 1)};
  const propsOfEntities: EntityProps[] = [props];
  const testPlan = ['   ', ' o ', '   '];

  const world = new World(testPlan, propsOfEntities, entityFactory, testSymbolHandler);

  const view = new View(world, new Vector(1, 1));
  view.put(N, view.get(NONE)!);
  expect(props.location).toStrictEqual(new Vector(1, 0));
});

it('should return previous entity on set', () => {
  const props1 = {location: new Vector(1, 0), id: 1};
  const props2 = {location: new Vector(1, 1), id: 2};
  const propsOfEntities: EntityProps[] = [props1, props2];
  const testPlan = [' o ', ' o ', '   '];
  const world = new World(testPlan, propsOfEntities, entityFactory, testSymbolHandler);
  const view = new View(world, new Vector(1, 1));

  // Move 2 to 1, returning 1:
  const previous = view.put(N, view.get(NONE)!);

  expect((previous?.props as any)?.id).toStrictEqual(1);
});
