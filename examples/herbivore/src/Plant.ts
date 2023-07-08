import {Entity} from 'pixcellular';
import {isPlantProps, PlantProps} from './PlantProps';

export class Plant implements Entity {
  public props: PlantProps;
  public symbol: string = '#';

  constructor(props: PlantProps) {
    if (!isPlantProps(props)) {
      throw new Error('Plant needs props');
    }
    this.props = props;
  }
}

export const plantBuilder = {build: (props) => new Plant(props as PlantProps)};
