import {Entity} from 'pixcellular';
import {HerbivoreProps} from './HerbivoreProps';
import {HERBIVORE} from './Symbols';

export class Herbivore implements Entity {
  public props: HerbivoreProps;
  public symbol: string = HERBIVORE;

  constructor(props: HerbivoreProps) {
    this.props = props;
  }
}
