import {BehaviourGraph, Entity, Vector, World} from 'pixcellular';
import {PlantBuilder} from './PlantBuilder';
import {PlantProps} from './PlantProps';
import {PLANT} from './Symbols';

export class Plant implements Entity {
  public props: PlantProps;
  public symbol: string = PLANT;
  public graph: BehaviourGraph<Plant>;
  public builder: PlantBuilder;

  constructor(
      props: PlantProps,
      graph: BehaviourGraph<Plant>,
      builder: PlantBuilder
  ) {
    this.props = props;
    this.graph = graph;
    this.builder = builder;
  }

  public handle(location: Vector, world: World): void {
    this.graph.traverse(this, world);
  }
}
