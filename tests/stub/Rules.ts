import {Rule, RuleGraph} from '../../src/RuleGraph';
import {SPACE} from '../../src/Space';
import MoveRule from './MoveRule';
import SleepRule from './SleepRule';

class RuleEntry {
  public name: string;
  public rule: Rule;

  constructor(name: string, rule: Rule) {
    this.name = name;
    this.rule = rule;
  }

  public addTo(graph: RuleGraph) {
    graph.addNode(this.name, this.rule);
  }
}

// Physics:
export const moveRule = new RuleEntry('moveRule', new MoveRule(SPACE));
export const sleepRule = new RuleEntry('sleepRule', new SleepRule(SPACE));
