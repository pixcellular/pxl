import {Behaviour, BehaviourGraph, BehaviourName, CENTRE, Direction, Neighbours, World} from 'pixcellular';
import {EAT, MOVE, REPRODUCE, START, STOP} from './Behaviours';
import {Herbivore} from './Herbivore';
import {isPlantProps} from './PlantProps';
import {store} from './Store';
import {PLANT, SPACE} from './Symbols';

const starting = new Behaviour<Herbivore>(
    START,
    (entity: Herbivore, world: World): BehaviourName => {
      const view = new Neighbours(world, entity.props.location);

      if (canReproduce(entity)) {
        return REPRODUCE;
      }
      const plantDir = view.findDir(e => e.symbol === PLANT);
      if (plantDir) {
        return EAT;
      }
      const spaceDir = view.findDir(e => e.symbol === SPACE);
      if (spaceDir) {
        return MOVE;
      }
      return;
    },
    [REPRODUCE, EAT, MOVE]
);

const reproducing = new Behaviour<Herbivore>(
    REPRODUCE,
    (entity: Herbivore, world: World): BehaviourName => {
      const view = new Neighbours(world, entity.props.location);
      const space = view.findDirRand(e => e.symbol === SPACE);
      if (space) {
        const childProps = {energy: Math.floor(entity.props.energy / 3)};
        const child = entity.builder.build(childProps);
        view.put(space, child);
        entity.props.energy -= child.props.energy * 2;
      }
      return STOP;
    },
    [STOP]
);

const eating = new Behaviour<Herbivore>(
    EAT,
    (entity: Herbivore, world: World): BehaviourName => {
      const view = new Neighbours(world, entity.props.location);
      const plantDir = view.findDirRand(e => e.symbol === PLANT);
      const plant = view.get(plantDir);
      if (isPlantProps(plant.props)) {
        entity.props.energy += plant.props.energy;
        view.remove(plantDir);
        return canReproduce(entity)
            ? REPRODUCE
            : STOP;
      } else {
        return MOVE;
      }
    },
    [REPRODUCE, MOVE, STOP]
);

const moving = new Behaviour<Herbivore>(
    MOVE,
    (entity: Herbivore, world: World): BehaviourName => {
      const view = new Neighbours(world, entity.props.location);
      let dir: Direction;
      if (view.get(entity.props.dir)?.symbol === SPACE) {
        // Move in props direction:
        dir = entity.props.dir;
      } else {
        // Find random space:
        dir = view.findDirRand(e => e.symbol === SPACE);
      }
      if (dir) {
        view.put(dir, entity);
        entity.props.dir = dir;
      }
      return STOP;
    },
    [STOP]
);

const stopping = new Behaviour<Herbivore>(
    STOP,
    (entity: Herbivore, world: World): BehaviourName => {
      entity.props.energy -= store.herbivoreMetabolismCosts;
      if (entity.props.energy <= 0) {
        const view = new Neighbours(world, entity.props.location);
        view.remove(CENTRE);
      }
      return null;
    },
    []
);

function canReproduce(entity: Herbivore) {
  return entity.props.energy > store.herbivoreReproductionThreshold;
}

export const herbivoreBehaviour = new BehaviourGraph<Herbivore>(starting);
herbivoreBehaviour.add(reproducing);
herbivoreBehaviour.add(eating);
herbivoreBehaviour.add(moving);
herbivoreBehaviour.add(stopping);

console.log('Herbivore behaviour graph in mermaid format:\n', herbivoreBehaviour.toString());
