import {EntityProps} from '../src';
import {NONE} from '../src';
import {EntityFactory} from '../src';
import {EntityHandlerMap} from '../src';
import {Rule, RuleGraph} from '../src';
import Action from '../src/Action';
import Entity from '../src/Entity';
import Vector from '../src/Vector';
import View from '../src/View';
import World from '../src/World';
import EntityStubHandler from './stub/EntityStubHandler';
import {SPACE} from './stub/Space';
import SpaceHandler from './stub/SpaceHandler';
import {WALL} from './stub/Wall';
import WallHandler from './stub/WallHandler';

const entityFactory = new EntityFactory();
entityFactory.add(' ', () => SPACE);
entityFactory.add('#', () => WALL);
entityFactory.add('o', () => ({symbol: 'o'} as Entity));

class EntryRule implements Rule {
  private toReturn: Action;

  constructor(toReturn: Action) {
    this.toReturn = toReturn;
  }

  public enforce(action: Action): Action {
    return this.toReturn;
  }
}

const testSymbolHandler = new EntityHandlerMap();
testSymbolHandler.add(' ', new SpaceHandler());
testSymbolHandler.add('#', new WallHandler());
testSymbolHandler.add('o',
  new EntityStubHandler(
    new RuleGraph('entryRule',
      new EntryRule(
        new Action('eat', NONE)
      ),
      'stop'
    )
  )
);

it('should contain all neighbours with char', () => {
  const propsOfElements: EntityProps[] = [];
  const testPlan = ['###', '#  ', '#  '];

  const world = new World(
    testPlan,
    entityFactory,
    propsOfElements,
    testSymbolHandler
  );

  const view = new View(world, new Vector(1, 1));
  const allWall = view.findAll('#');
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
  const propsOfElements: EntityProps[] = [];
  const testPlan = ['o  ', ' o ', '  o'];

  const world = new World(
    testPlan,
    entityFactory,
    propsOfElements,
    testSymbolHandler
  );

  const view = new View(world, new Vector(1, 1));
  const allWall = view.findAll('o');
  const expectedDirs: string[] = ['se', 'nw'];
  expect(expectedDirs).toStrictEqual(allWall.map(w => w.toString()));

});
