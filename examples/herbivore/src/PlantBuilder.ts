import {BehaviourGraph, EntityBuilder} from 'pixcellular';
import {Plant} from './Plant';
import {isPlantProps, PlantProps} from './PlantProps';

export class PlantBuilder implements EntityBuilder {
  private defaultProps: PlantProps;
  private graph: BehaviourGraph<Plant>;

  constructor(
      defaultProps: PlantProps,
      graph: BehaviourGraph<Plant>
  ) {
    this.defaultProps = defaultProps;
    this.graph = graph;
  }

  public build(props) {
    if (!isPlantProps(props)) {
      props = Object.assign({}, this.defaultProps, props);
    }
    return new Plant(props as PlantProps, this.graph, this);
  }
}
