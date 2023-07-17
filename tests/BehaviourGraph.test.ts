import BehaviourGraph, {Behaviour} from '../src/BehaviourGraph';
import World from '../src/World';
import {EAT, START, STOP} from './stub/Behaviours';
import {EntityStub} from './stub/EntityStub';
import {EntityStubProps} from './stub/EntityStubProps';

it('should create graph in mermaid format', () => {
  const start = new Behaviour(START, () => EAT, [EAT]);
  const stop = new Behaviour(STOP, () => null, []);
  const eating = new Behaviour(EAT, () => {
    return STOP;
  }, [STOP]);

  const graph = new BehaviourGraph(start);
  graph.add(eating);
  graph.add(stop);

  const expectedDotGraph = `graph TD
  START((START))
  START --> EAT
  EAT --> STOP\n`;

  const dotFormatgraph = graph.toString();
  expect(dotFormatgraph).toBe(expectedDotGraph);
});

it('should traverse graph', () => {
  const start = new Behaviour(START, () => EAT, [EAT]);
  const graph = new BehaviourGraph(start);
  graph.add(new Behaviour(
      EAT,
      () => STOP,
      [STOP]
  ));
  graph.add(new Behaviour(
      STOP,
      () => null,
      []
  ));

  const expectedWalk = ['START', 'EAT', 'STOP'];
  const walk = graph.traverse(new EntityStub({} as EntityStubProps, {} as BehaviourGraph<EntityStub>), {} as World);
  expect(JSON.stringify(walk)).toBe(JSON.stringify(expectedWalk));
});

it('should validate', () => {
  const start = new Behaviour(START, () => EAT, [EAT]);
  const graph = new BehaviourGraph(start);
  graph.add(new Behaviour(
      EAT,
      () => STOP,
      [STOP]
  ));
  graph.add(new Behaviour(
      STOP,
      () => null,
      []
  ));
  expect(graph.validate()).toStrictEqual({valid: true, errors: []});
});

it('should invalidate when a behaviour is missing', () => {
  const start = new Behaviour(START, () => EAT, [EAT]);
  const graph = new BehaviourGraph(start);
  graph.add(new Behaviour(
      EAT,
      () => STOP,
      [STOP]
  ));
  expect(graph.validate().valid).toBe(false);
  expect(graph.validate().errors).toStrictEqual([{
    error: 'Behaviour \'STOP\' does not exist',
    walk: ['START', 'EAT', 'STOP']
  }]);
});

it('should throw error when traversing with missing behaviour', () => {
  const start = new Behaviour(START, () => EAT, [EAT]);
  const graph = new BehaviourGraph(start);

  // Stop is missing:
  graph.add(new Behaviour(EAT, () => STOP, [STOP]));

  let exceptionThrown = null;
  try {
    graph.traverse({} as any, {} as any);
  } catch (e) {
    exceptionThrown = e;
  }
  expect(exceptionThrown).not.toBeNull();
  expect((exceptionThrown as Error).message).toContain('Graph not valid');
});
