import { EntityBuilder, randomDirection, randomElement } from 'pixcellular';
import {Herbivore} from './Herbivore';
import {HerbivoreProps} from './HerbivoreProps';

export class HerbivoreBuilder implements EntityBuilder {
  private defaultEnergy: number;
  constructor(defaultEnergy: number) {
    this.defaultEnergy = defaultEnergy;
  }
  public build(props) {
    const newProps = this.createProps(props);
    return new Herbivore(newProps);
  }

  private createProps(props): HerbivoreProps {
    return {
      energy: props.energy || this.defaultEnergy,
      dir: randomDirection()
    };
  }
}
