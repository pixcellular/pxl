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
    let newProps: PlantProps = props;
    if (!isPlantProps(props)) {
      newProps = Object.assign({}, this.defaultProps, props);
      newProps.energy = Math.random() * this.defaultProps.energy;
    }
    return new Plant(newProps, this.graph, this);
  }
}
