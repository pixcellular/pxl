import {Entity} from 'pixcellular';
import {PlantProps} from './PlantProps';
import {PLANT} from './Symbols';

export class Plant implements Entity {
  public props: PlantProps;
  public symbol: string = PLANT;

  constructor(props: PlantProps) {
    this.props = props;
  }
}

