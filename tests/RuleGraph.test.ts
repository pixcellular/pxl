import Action from '../src/Action';
import {NONE, SE} from '../src/Direction';
import {Rule, RuleGraph} from '../src/RuleGraph';

class EntryRule implements Rule {
  private toReturn: Action;

  constructor(toReturn: Action) {
    this.toReturn = toReturn;
  }

  public enforce(action: Action): Action {
    return this.toReturn;
  }
}

it('should create graph in dot format', () => {
  const entryRuleName = 'entryRule';

  const exitActionType = 'exit';

  class EatRule implements Rule {
    public enforce(action: Action): Action {
      return new Action(exitActionType, NONE);
    }
  }

  const eatRule = new EatRule();

  const rules = new RuleGraph(entryRuleName, new EntryRule(new Action('eat', NONE)), exitActionType);
  rules.addNode('eatRule', eatRule);
  rules.addLink(entryRuleName, 'eat', 'eatRule');
  rules.addLink('eatRule', exitActionType);

  const expectedDotGraph = 'digraph RuleGraph {\n' +
    '  node [shape="box"];\n' +
    '  exitRule [shape=circle, label=""]\n' +
    '  entryRule [shape=circle]\n' +
    '  entryRule -> eatRule [label="eat"];\n' +
    '  eatRule -> exitRule [label="exit"];\n' +
    '}\n';

  const dotFormatgraph = rules.toString();
  expect(dotFormatgraph).toBe(expectedDotGraph);
});

it('should traverse graph', () => {
  const entryRuleName = 'entryRule';
  const exitActionType = 'exit';

  class EatRule implements Rule {
    public enforce(action: Action): Action {
      return new Action('sleep', NONE);
    }
  }

  class SleepRule implements Rule {
    public enforce(action: Action): Action {
      return new Action(exitActionType, NONE);
    }
  }

  const rules = new RuleGraph(entryRuleName, new EntryRule(new Action('eat', SE)), exitActionType);

  rules.addNode('eatRule', new EatRule());
  rules.addNode('sleepRule', new SleepRule());

  rules.addLink(entryRuleName, 'eat', 'eatRule');
  rules.addLink('eatRule', 'sleep', 'sleepRule');
  rules.addLink('sleepRule', exitActionType);

  const expectedWalk = [
    {
      type: 'eat',
      direction: {
        cardinal: 'se',
        vector: {
          x: 1,
          y: 1
        }
      }
    },
    {
      type: 'sleep',
      direction: {
        cardinal: 'none',
        vector: {
          x: 0,
          y: 0
        }
      }
    },
    {
      type: 'exit',
      direction: {
        cardinal: 'none',
        vector: {
          x: 0,
          y: 0
        }
      }
    }
  ];
  const walk = rules.traverse(null, null);
  expect(JSON.stringify(walk)).toBe(JSON.stringify(expectedWalk));
});
