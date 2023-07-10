import Action, {ActionType} from './Action';
import Entity from './Entity';
import {EntityHandler} from './EntityHandler';
import Vector from './Vector';
import World from './World';

export type GraphHandler<T extends Entity> = (action: Action, entity: T, world: World) => Action;

export type BehaviourName = string;
export class Behaviour<T extends Entity> {
  public name: BehaviourName;
  public handle: GraphHandler<T>;

  constructor(name: string, handle: GraphHandler<T>) {
    this.name = name;
    this.handle = handle;
  }
}

/**
 * Every {@link Behaviour} results in a number of response behaviours linked by {@link Action}s
 */
export class LinkedBehaviour<T extends Entity> {
  public behaviour: Behaviour<T>;

  /**
   * Directed links named by actionType
   */
  public readonly actions: Record<ActionType, LinkedBehaviour<T>> = {};

  constructor(behaviour: Behaviour<T>) {
    this.behaviour = behaviour;
  }
}

/**
 * Directed graph of behaviours, one behaviour resulting in the next,
 * is used to split up complex behaviour into smaller parts,
 * always starts with {@link startBehaviour} and ends with {@link stopBehaviour}.
 */
export default class BehaviourGraph<T extends Entity> {

  private startAction: Action = new Action('');
  private startBehaviour: Behaviour<T>;
  private stopBehaviour: Behaviour<T>;
  private behaviours: Record<string, LinkedBehaviour<T>> = {};

  constructor(
      start: Behaviour<T>,
      stop: Behaviour<T>
  ) {
    this.startBehaviour = start;
    this.stopBehaviour = stop;
    this.behaviours[start.name] = new LinkedBehaviour(start);
    this.behaviours[stop.name] = new LinkedBehaviour(stop);
  }

  /**
   * Add behaviour node to graph
   */
  public add(b: Behaviour<T>) {
    this.behaviours[b.name] = new LinkedBehaviour(b);
  }

  /**
   * Link two behaviour nodes using action link
   */
  public link(
      b1: Behaviour<T>,
      action: Action,
      b2: Behaviour<T>
  ) {
    const b1ToTriggers = this.behaviours[b1.name];
    if (!b1ToTriggers) {
      throw new Error(`No behaviour exists with name '${b1.name}'`);
    }
    if (b1ToTriggers.actions[action.type]) {
      throw new Error(`Trigger '${action}' already exists for behaviour ${b1}`);
    }
    const b2ToTriggers = this.behaviours[b2.name];
    if (!b2ToTriggers) {
      throw new Error(`No behaviour exists with name '${b2.name}'`);
    }
    b1ToTriggers.actions[action.type] = b2ToTriggers;
  }

  /**
   *
   */
  public traverse(entity: T, world: World): BehaviourName[] {
    const walk: string[] = [];
    let linkedBehaviour: LinkedBehaviour<T> = this.behaviours[this.startBehaviour.name];
    let action = this.startAction;
    do {
      const behaviour = linkedBehaviour.behaviour;
      walk.push(behaviour.name);
      action = behaviour.handle(action, entity, world);
      const nextBehaviour = linkedBehaviour.actions[action.type];
      if (!nextBehaviour) {
        throw Error(`Behaviour '${behaviour.name}' has no action '${action.type}'`);
      }
      linkedBehaviour = nextBehaviour;
    } while (!this.isEndBehaviour(linkedBehaviour));
    this.stopBehaviour.handle(action, entity, world);
    walk.push(this.stopBehaviour.name);
    return walk;
  }

  /**
   * @return behaviour graph in {@link https://mermaid.live/edit)|mermaid} format
   */
  public toString() {
    let result = 'graph TD\n';
    result += `  ${this.startBehaviour.name}((${this.startBehaviour.name}))\n`;
    result += `  ${this.stopBehaviour.name}((${this.stopBehaviour.name}))\n`;
    const links = Array.from(new Set(this.nodeToLinks(this.startBehaviour.name)));
    for (const l of links) {
      result += `  ${l}\n`;
    }
    return result;
  }

  /**
   * Convert linked behaviour into array of links in dot format
   */
  private nodeToLinks(name: string): string[] {
    let result: string[] = [];
    const head = this.behaviours[name];
    for (const action of Object.keys(head.actions)) {
      const tail = head.actions[action];
      result.push(`${name} --> |${action}|${tail.behaviour.name}`);
      if (tail.behaviour.name !== this.stopBehaviour.name) {
        result = result.concat(this.nodeToLinks(tail.behaviour.name));
      }
    }
    return result;
  }

  private isEndBehaviour(lb: LinkedBehaviour<T>): boolean {
    return lb.behaviour.name === this.stopBehaviour.name;
  }

}

export class BehaviourGraphHandler <E extends Entity> implements EntityHandler {

  private graph: BehaviourGraph<E>;
  constructor(graph: BehaviourGraph<E>) {
    this.graph = graph;
  }

  public handle(entity: E, location: Vector, world: World): void {
    this.graph.traverse(entity, world);
  }
}
