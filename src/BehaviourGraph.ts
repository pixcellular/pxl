import Entity from './Entity';
import {EntityHandler} from './EntityHandler';
import Vector from './Vector';
import World from './World';

export type BehaviourName = string;

// TODO?
// export type Response = {
//   name: string;
//   nextBehaviour: BehaviourName,
// };

export type PerformBehaviour<T extends Entity> = (entity: T, world: World) => BehaviourName | null;

type ValidationErrorMsg = {
  walk: string[],
  error: string
};
export type ValidateReport = {
  valid: boolean;
  errors: ValidationErrorMsg[];
};
export class GraphValidationError extends Error {
  constructor(report: ValidateReport) {
    super(`Graph not valid: ${JSON.stringify(report)}`);
  }
}

export class Behaviour<T extends Entity> {
  public name: BehaviourName;
  public perform: PerformBehaviour<T>;
  public responses: BehaviourName[];

  constructor(
      name: string,
      perform: PerformBehaviour<T>,
      responses: BehaviourName[]
  ) {
    this.name = name;
    this.perform = perform;
    this.responses = responses;
  }
}

/**
 * Directed graph of behaviours, one behaviour resulting in the next,
 * is used to split up complex behaviour into smaller parts,
 * always starts with {@link startBehaviourName}.
 */
export default class BehaviourGraph<T extends Entity> {

  private readonly startBehaviourName: BehaviourName;
  private behaviours: Record<string, Behaviour<T>> = {};
  private validation: ValidateReport = {valid: true, errors: []};

  constructor(
      start: Behaviour<T>,
  ) {
    this.startBehaviourName = start.name;
    this.add(start);
  }

  /**
   * Add behaviour node to graph
   */
  public add(behaviour: Behaviour<T>) {
    this.behaviours[behaviour.name] = behaviour;
    this.validate();
  }

  /**
   *
   */
  public traverse(entity: T, world: World): BehaviourName[] {
    if (!this.validation.valid) {
      throw new GraphValidationError(this.validation);
    }
    const walk: string[] = [];
    let nextBehaviourName: string | null = this.startBehaviourName;
    while (nextBehaviourName) {
      const behaviour: Behaviour<T> = this.behaviours[nextBehaviourName];
      if (walk.includes(behaviour.name)) {
        throw new Error('Cycle detected while traversing: ' + [...walk, behaviour.name].join(','));
      }
      walk.push(behaviour.name);
      nextBehaviourName = behaviour.perform(entity, world);
    }
    return walk;
  }

  /**
   * Check that all responses are linked to existing behaviours
   */
  public validate() {
    this.validation = this.validateBehaviour(this.startBehaviourName, []);
    return this.validation;
  }

  /**
   * @return behaviour graph in {@link https://mermaid.live/edit)|mermaid} format
   */
  public toString() {
    let result = 'graph TD\n';
    result += `  ${this.startBehaviourName}((${this.startBehaviourName}))\n`;
    const links = Array.from(new Set(this.nodeToLinks(this.startBehaviourName)));
    for (const l of links) {
      result += `  ${l}\n`;
    }
    return result;
  }

  /**
   * Convert linked behaviour into array of links in dot format
   */
  private nodeToLinks(name: string): string[] {
    if (!this.validation.valid) {
      throw new GraphValidationError(this.validation);
    }
    let result: string[] = [];
    const headNode = this.behaviours[name];
    for (const response of headNode.responses) {
      const tailNode = this.behaviours[response];
      result.push(`${name} --> ${tailNode.name}`);
      result = result.concat(this.nodeToLinks(tailNode.name));
    }
    return result;
  }

  /**
   * @return {ValidateReport}
   */
  private validateBehaviour(name: BehaviourName, parents: BehaviourName[]) {
    const report: ValidateReport = {valid: true, errors: []};
    const behaviour = this.behaviours[name];
    const walk = [...parents, name];
    if (!behaviour) {
      report.valid = false;
      report.errors.push({error: `Behaviour '${name}' does not exist`, walk});
    } else if (behaviour.responses.length) {
      behaviour.responses.forEach(r => {
        const responseReport = this.validateBehaviour(r, walk);
        if (!responseReport.valid) {
          report.valid = false;
          report.errors.push(...responseReport.errors);
        }
      });
    }
    return report;
  }
}

export class BehaviourGraphHandler<E extends Entity> implements EntityHandler {

  private graph: BehaviourGraph<E>;

  constructor(graph: BehaviourGraph<E>) {
    this.graph = graph;
  }

  public handle(entity: E, location: Vector, world: World): void {
    this.graph.traverse(entity, world);
  }
}
