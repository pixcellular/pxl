import {Behaviour, BehaviourGraph, CENTRE, EntityProps, N} from '../src';
import {EntityBuilderMap} from '../src';
import Neighbours from '../src/Neighbours';
import {SPACE} from '../src/Space';
import Vector from '../src/Vector';
import View from '../src/View';
import World from '../src/World';
import {START, STOP} from './stub/Behaviours';
import {EntityStub} from './stub/EntityStub';
import {EntityStubProps} from './stub/EntityStubProps';
import {Wall} from './stub/Wall';

const entityFactory = new EntityBuilderMap();
entityFactory.add(' ', {build: () => SPACE});
entityFactory.add('#', {build: (props) => new Wall('#', props)});
entityFactory.add('o', {
  build: (props) => new EntityStub(
      props as EntityStubProps,
      {} as BehaviourGraph<EntityStub>
  )
});

const entryRule = new Behaviour(START, () => STOP, [STOP]);
const stopRule = new Behaviour(STOP, () => null, []);
const behaviourGraph = new BehaviourGraph(entryRule);
behaviourGraph.add(stopRule);

it('should contain all neighbours with char', () => {
  const propsOfEntities: EntityProps[] = [];
  const testPlan = ['###', '#  ', '#  '];

  const world = new World({
    map: testPlan,
    entityProps: propsOfEntities,
    builders: entityFactory,
  });

  const view = new Neighbours(world, new Vector(1, 1));
  const allWall = view.findDirs(e => e.symbol === '#');
  const expectedDirs: string[] = [
    'N',
    'NE',
    'SW',
    'W',
    'NW'
  ];
  expect(allWall.map(w => w.toString())).toStrictEqual(expectedDirs);
});

it('should not find itself', () => {
  const propsOfEntities: EntityProps[] = [];
  const testPlan = ['o  ', ' o ', '  o'];

  const world = new World({
    map: testPlan,
    entityProps: propsOfEntities,
    builders: entityFactory,
  });

  const view: View = new Neighbours(world, new Vector(1, 1));
  const allO = view.findDirs(e => e.symbol === 'o');
  const expectedDirs: string[] = ['SE', 'NW'];
  expect(expectedDirs).toStrictEqual(allO.map(w => w.toString()));
});

it('should update props.location on set', () => {
  const props = {location: new Vector(1, 1)};
  const propsOfEntities: EntityProps[] = [props];
  const testPlan = ['   ', ' o ', '   '];

  const world = new World({
    map: testPlan,
    entityProps: propsOfEntities,
    builders: entityFactory,
  });

  const view = new Neighbours(world, new Vector(1, 1));
  view.put(N, view.get(CENTRE)!);
  expect(props.location).toStrictEqual(new Vector(1, 0));
});

it('should return previous entity on set', () => {
  const props1 = {location: new Vector(1, 0), id: 1};
  const props2 = {location: new Vector(1, 1), id: 2};
  const propsOfEntities: EntityProps[] = [props1, props2];
  const testPlan = [' o ', ' o ', '   '];
  const world = new World({
    map: testPlan,
    entityProps: propsOfEntities,
    builders: entityFactory,
  });
  const view = new Neighbours(world, new Vector(1, 1));

  // Move 2 to 1, returning 1:
  const previous = view.put(N, view.get(CENTRE)!);

  expect((previous?.props as any)?.id).toStrictEqual(1);
});
