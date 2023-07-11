import {Action, Behaviour, BehaviourGraph, Direction, NONE, View, World} from 'pixcellular';
import {EAT, MOVE, NOOP, REPRODUCE, STOP} from './Actions';
import {Herbivore} from './Herbivore';
import {HerbivoreBuilder} from './HerbivoreBuilder';
import {isPlantProps} from './PlantProps';
import {SpaceBuilder} from './SpaceBuilder';
import {store} from './Store';
import {PLANT, SPACE} from './Symbols';

const herbivoreBuilder = new HerbivoreBuilder(10);
const spaceBuilder = new SpaceBuilder();

const starting = new Behaviour<Herbivore>(
    'starting',
    (action: Action, entity: Herbivore, world: World): Action => {
      const view = new View(world, entity.props.location);

      const spaceDir = view.findDirRand(e => e.symbol === SPACE);
      const canReproduce = entity.props.energy > store.herbivoreReproductionThreshold;

      if (canReproduce) {
        return new Action(REPRODUCE.type, spaceDir);
      }
      const plantDir = view.findDirRand(e => e.symbol === PLANT);
      if (plantDir) {
        return new Action(EAT.type, plantDir);
      }
      if (spaceDir) {
        return new Action(MOVE.type);
      }
      return STOP;
    }
);

const reproducing = new Behaviour<Herbivore>(
    'reproducing',
    (action: Action, entity: Herbivore, world: World): Action => {
      const view = new View(world, entity.props.location);
      const space = view.findDirRand(e => e.symbol === SPACE);
      if (space) {
        const child = herbivoreBuilder.build({energy: Math.floor(entity.props.energy / 3)});
        view.put(space, child);
        entity.props.energy -= child.props.energy * 2;
      }
      return STOP;
    }
);

const eating = new Behaviour<Herbivore>(
    'eating',
    (action: Action, entity: Herbivore, world: World): Action => {
      const view = new View(world, entity.props.location);
      const plant = view.get(action.direction);
      if (isPlantProps(plant.props)) {
        view.put(action.direction, spaceBuilder.build());
        entity.props.energy += plant.props.energy;
        return STOP;
      } else {
        return MOVE;
      }
    }
);

const moving = new Behaviour<Herbivore>(
    'growing',
    (action: Action, entity: Herbivore, world: World): Action => {
      const view = new View(world, entity.props.location);
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
    }
);

const stopping = new Behaviour<Herbivore>(
    'stopping',
    (action: Action, entity: Herbivore, world: World): Action => {
      entity.props.energy -= store.herbivoreMetabolismCosts;
      if (entity.props.energy <= 0) {
        const view = new View(world, entity.props.location);
        view.remove(NONE);
      }
      return NOOP;
    }
);

export const herbivoreBehaviour = new BehaviourGraph<Herbivore>(starting, stopping);
herbivoreBehaviour.add(reproducing);
herbivoreBehaviour.add(eating);
herbivoreBehaviour.add(moving);

herbivoreBehaviour.link(starting, REPRODUCE, reproducing);
herbivoreBehaviour.link(starting, MOVE, moving);
herbivoreBehaviour.link(starting, EAT, eating);
herbivoreBehaviour.link(starting, STOP, stopping);

herbivoreBehaviour.link(eating, MOVE, moving);
herbivoreBehaviour.link(eating, STOP, stopping);

herbivoreBehaviour.link(reproducing, STOP, stopping);
herbivoreBehaviour.link(moving, STOP, stopping);

console.log('Herbivore behaviour graph in mermaid format:\n', herbivoreBehaviour.toString());
