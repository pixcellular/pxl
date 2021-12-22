import Action from './Action';
import {NONE} from './Direction';
import Entity from './Entity';
import World from './World';

/**
 * Organize complex behaviour of entities using a graph
 * consisting of nodes (behavioural rules) connected with links (desired actions)
 *
 * Use graph.toString() to visualize the resulting graph
 */
export class RuleGraph {

  /**
   * Linked rule nodes by rule name
   */
  private rules: Record<string, RuleNodeWithLinks>;

  /**
   * Name of rule to start graph walk
   */
  private entryAction: Action;

  /**
   * Last rule in walk, should not be called
   */
  private readonly exitNode: RuleNodeWithLinks;

  /**
   * Name of link that marks end of walk
   */
  private readonly exitLink: string;

  constructor(entryRuleName: string, entryRule: Rule, exitActionType: string) {
    this.rules = {};
    this.entryAction = new Action(entryRuleName, NONE);
    this.addNode(this.entryAction.type, entryRule);
    this.exitNode = new RuleNodeWithLinks('exitRule', new ExitRule());
    this.exitLink = exitActionType;
  }

  /**
   * Add rule to graph
   */
  public addNode(name: string, rule: Rule) {
    this.rules[name] = new RuleNodeWithLinks(name, rule);
  }

  /**
   * Link rule with next rule using actionType
   * ruleName1: head node
   * ruleName2: optional tail node
   * actionType: link
   */
  public addLink(ruleName1: string, actionType: string, ruleName2?: string) {
    const rule1 = this.rules[ruleName1];
    if (!rule1) {
      throw new Error(`No rule exists with name '${ruleName1}'`);
    }
    if (rule1.links[actionType]) {
      throw new Error(`Rule link with actionType '${actionType}' already exists`);
    }
    if (!ruleName2 && actionType !== this.exitLink) {
      throw new Error(`When end node is omitted, actionType should be exitActionType: '${this.exitLink}'`);
    }
    if (ruleName2) {
      const rule2 = this.rules[ruleName2];
      if (!rule2) {
        throw new Error(`No rule exists with name '${ruleName2}'`);
      }
      rule1.links[actionType] = rule2;
    } else {
      rule1.links[this.exitLink] = this.exitNode;
    }
  }

  /**
   * Traverse rule graph
   */
  public traverse(entity: Entity, world: World): Action[] {
    const walk = [];
    let node = this.rules[this.entryAction.type];
    let nextAction = this.entryAction;

    do {
      nextAction = node.rule.enforce(nextAction, entity, world);
      walk.push(nextAction);
      const nextNode = node.links[nextAction.type];
      if (!nextNode) {
        throw Error(`Node '${node.name}' has no link '${nextAction.type}'`);
      }
      node = nextNode;
    } while (nextAction.type !== this.exitLink);

    return walk;
  }

  /**
   * @return rule graph in {@link https://en.wikipedia.org/wiki/DOT_(graph_description_language)|DOT} format
   */
  public toString() {
    let result = 'digraph RuleGraph {\n';
    result += '  node [shape="box"];\n';
    result += `  ${this.exitNode.name} [shape=circle, label=""]\n`;
    result += `  ${this.entryAction.type} [shape=circle]\n`;
    const links = Array.from(new Set(this.nodeToLinks(this.entryAction.type)));
    for (const l of links) {
      result += `  ${l}\n`;
    }
    result += '}\n';
    return result;
  }

  private nodeToLinks(name: string): string[] {
    let result: string[] = [];
    const head = this.rules[name];
    for (const link of Object.keys(head.links)) {
      const tail = head.links[link];
      result.push(`${name} -> ${tail.name} [label="${link}"];`);
      if (link !== this.exitLink) {
        result = result.concat(this.nodeToLinks(tail.name));
      }
    }
    return result;
  }
}

export interface Rule {
  enforce(action: Action, entity: Entity, world: World): Action;
}

export class RuleNodeWithLinks {
  public rule: Rule;
  public name: string;

  /**
   * Directed links named by actionType
   */
  public readonly links: Record<string, RuleNodeWithLinks>;

  constructor(name: string, rule: Rule) {
    this.name = name;
    this.rule = rule;
    this.links = {};
  }
}

export class ExitRule implements Rule {
  public enforce(action: Action): Action {
    throw new Error('exitRule.act should not be called');
  }
}
