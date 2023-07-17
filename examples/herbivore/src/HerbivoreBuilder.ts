import {BehaviourGraph, EntityBuilder, randomDirection, randomElement } from 'pixcellular';
import {Herbivore} from './Herbivore';
import {HerbivoreProps} from './HerbivoreProps';

export class HerbivoreBuilder implements EntityBuilder {
  private defaultEnergy: number;
  private graph: BehaviourGraph<Herbivore>;
  constructor(defaultEnergy: number, graph: BehaviourGraph<Herbivore>) {
    this.defaultEnergy = defaultEnergy;
    this.graph = graph;
  }
  public build(props) {
    const newProps = this.createProps(props);
    return new Herbivore(newProps, this.graph, this);
  }

  private createProps(props): HerbivoreProps {
    const newProps = {
      energy: props.energy || this.defaultEnergy,
      dir: randomDirection(),
    };
    return Object.assign(newProps, props);
  }
}
