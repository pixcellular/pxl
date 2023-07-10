import {EntityBuilder} from 'pixcellular';
import {Plant} from './Plant';
import {isPlantProps, PlantProps} from './PlantProps';

export class PlantBuilder implements EntityBuilder {
  private defaultProps: PlantProps;

  constructor(defaultProps: PlantProps) {
    this.defaultProps = defaultProps;
  }

  public build(props) {
    if (!isPlantProps(props)) {
      props = Object.assign({}, this.defaultProps, props);
    }
    return new Plant(props as PlantProps);
  }
}
