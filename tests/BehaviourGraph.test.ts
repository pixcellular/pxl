import Action from '../src/Action';
import BehaviourGraph, {Behaviour} from '../src/BehaviourGraph';
import World from '../src/World';
import {EntityStub} from './stub/EntityStub';
import {EntityStubProps} from './stub/EntityStubProps';

it('should create graph in dot format', () => {
  const eat = new Action('eat');
  const startNode = new Behaviour('start', () => eat);
  const stop = new Action('stop');
  const stopNode = new Behaviour('stop', () => stop);

  const graph = new BehaviourGraph(startNode, stopNode);

  const eating = new Behaviour('eating', () => {
    return stop;
  });

  graph.add(eating);
  graph.link(startNode, eat, eating);
  graph.link(eating, stop, stopNode);

  const expectedDotGraph = `graph TD
  start((start))
  stop((stop))
  start --> |eat|eating
  eating --> |stop|stop\n`;

  const dotFormatgraph = graph.toString();
  expect(dotFormatgraph).toBe(expectedDotGraph);
});

it('should traverse graph', () => {
  const eat = new Action('eat');
  const startNode = new Behaviour('start', () => eat);
  const stop = new Action('stop');
  const stopNode = new Behaviour('stop', () => stop);

  const graph = new BehaviourGraph(startNode, stopNode);

  const eating = new Behaviour('eating', () => {
    return stop;
  });

  graph.add(eating);
  graph.link(startNode, eat, eating);
  graph.link(eating, stop, stopNode);

  const expectedWalk = ['start', 'eating', 'stop'];
  const walk = graph.traverse(new EntityStub({} as EntityStubProps), {} as World);
  expect(JSON.stringify(walk)).toBe(JSON.stringify(expectedWalk));
});
