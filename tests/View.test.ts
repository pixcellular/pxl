import {EntityProps, N} from '../src';
import {NONE} from '../src';
import {EntityFactory} from '../src';
import {EntityHandlerMap} from '../src';
import {Rule, RuleGraph} from '../src';
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

const entityFactory = new EntityFactory();
entityFactory.add(' ', () => SPACE);
entityFactory.add('#', (props) => new Wall('#', props));
entityFactory.add('o', (props) => new EntityStub(props as EntityStubProps));

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
  const propsOfEntities: EntityProps[] = [];
  const testPlan = ['###', '#  ', '#  '];

  const world = new World(testPlan, propsOfEntities, entityFactory, testSymbolHandler);

  const view = new View(world, new Vector(1, 1));
  const allWall = view.filter(e => e.symbol === '#');
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
  const allO = view.filter(e => e.symbol === 'o');
  const expectedDirs: string[] = ['se', 'nw'];
  expect(expectedDirs).toStrictEqual(allO.map(w => w.toString()));
});

it('should update props.location on move', () => {
  const props = {location: new Vector(1, 1)};
  const propsOfEntities: EntityProps[] = [props];
  const testPlan = ['   ', ' o ', '   '];

  const world = new World(testPlan, propsOfEntities, entityFactory, testSymbolHandler);

  const view = new View(world, new Vector(1, 1));
  view.move(N);
  expect(props.location).toStrictEqual(new Vector(1, 0));
});
