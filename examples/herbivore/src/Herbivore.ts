import {BehaviourGraph, Entity, Vector, World} from 'pixcellular';
import {HerbivoreBuilder} from './HerbivoreBuilder';
import {HerbivoreProps} from './HerbivoreProps';
import {HERBIVORE} from './Symbols';

export class Herbivore implements Entity {
  public props: HerbivoreProps;
  public symbol: string = HERBIVORE;
  public graph: BehaviourGraph<Herbivore>;
  public builder: HerbivoreBuilder;

  constructor(
      props: HerbivoreProps,
      graph: BehaviourGraph<Herbivore>,
      builder: HerbivoreBuilder
  ) {
    this.props = props;
    this.graph = graph;
    this.builder = builder;
  }

  public handle(location: Vector, world: World): void {
    this.graph.traverse(this, world);
  }
}
