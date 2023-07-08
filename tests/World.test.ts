import {EntityFactory} from '../src';
import {EntityHandlerMap} from '../src';
import {EntityProps} from '../src';
import {RuleGraph} from '../src';
import Direction, {E} from '../src/Direction';
import Entity from '../src/Entity';
import {SPACE} from '../src/Space';
import randomDirection from '../src/util/randomDirection';
import Vector from '../src/Vector';
import World from '../src/World';
import {exit, move, sleep} from './stub/Actions';
import {EntityStub} from './stub/EntityStub';
import {EntityStubBehaviourRule} from './stub/EntityStubBehaviourRule';
import EntityStubHandler from './stub/EntityStubHandler';
import {EntityStubProps} from './stub/EntityStubProps';
import {moveRule, sleepRule} from './stub/Rules';
import SpaceHandler from './stub/SpaceHandler';
import {Wall} from './stub/Wall';
import WallHandler from './stub/WallHandler';

const entryRuleName = 'entryRule';

const testSymbolHandler = new EntityHandlerMap();
testSymbolHandler.add(' ', new SpaceHandler());
testSymbolHandler.add('#', new WallHandler());

// Create rule graph:
const organismRules = new RuleGraph(entryRuleName, new EntityStubBehaviourRule(), exit);
// Add rules:
organismRules.addNode(moveRule.name, moveRule.rule);
organismRules.addNode(sleepRule.name, sleepRule.rule);
// Link rules by their results:
organismRules.addLink(entryRuleName, move, moveRule.name);
organismRules.addLink(moveRule.name, sleep, sleepRule.name);
organismRules.addLink(moveRule.name, move, sleepRule.name);
organismRules.addLink(sleepRule.name, exit);

testSymbolHandler.add('o', new EntityStubHandler(organismRules));

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

  const entityFactory = new EntityFactory();
  entityFactory.add(' ', () => SPACE);
  entityFactory.add('#', (props) => new Wall('#', props));
  entityFactory.add('o', (props) => new Org('o', props));
  const testPlan = ['#o', '# '];
  const world = new World(testPlan, [], entityFactory, testSymbolHandler);
  expect(world.getGrid().toString()).toBe(testPlan.join('\n'));
});

it('should move test organism to east', () => {
  console.log('rules:\n', (testSymbolHandler.get('o') as EntityStubHandler).rules.toString());
  const location = new Vector(0, 0);
  const props = new EntityStubProps(location, E, 40);

  const entityFactory = new EntityFactory();
  entityFactory.add(' ', () => SPACE);
  entityFactory.add('o', (p) => new EntityStub(p as EntityStubProps));

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

  const entityFactory = new EntityFactory();
  entityFactory.add(' ', () => SPACE);
  entityFactory.add('o', (p) => new EntityStub(p as EntityStubProps));

  const startPlan = 'o  ';
  const expectedPlan = ' o ';

  const world = new World([startPlan], [props], entityFactory, testSymbolHandler);

  const result = world.turn();

  expect(result.toString()).toBe(expectedPlan);
  expect(props.location).toEqual({x: 1, y: 0});
});
