import {Action, Behaviour, BehaviourGraph, View, World} from 'pixcellular';
import {CLONE, GROW, NOOP, STOP} from './Actions';
import {Plant} from './Plant';
import {PlantBuilder} from './PlantBuilder';
import {store} from './Store';
import {SPACE} from './Symbols';

const starting = new Behaviour<Plant>(
    'starting',
    (action: Action, entity: Plant, world: World): Action => {
      if (entity.props.energy > store.plantCloneThreshold) {
        return CLONE;
      } else {
        return GROW;
      }
    }
);
const stopping = new Behaviour<Plant>(
    'stopping',
    () => NOOP
);

const growing = new Behaviour<Plant>(
    'growing',
    (action: Action, entity: Plant, world: World): Action => {
      entity.props.energy += store.plantGrowEnergy;
      return STOP;
    }
);

const plantBuilder = new PlantBuilder({energy: 5});
const cloning = new Behaviour<Plant>(
    'cloning',
    (action: Action, entity: Plant, world: World): Action => {
      const view = new View(world, entity.props.location);
      const space = view.findDirRand(e => e.symbol === SPACE);
      if (space) {
        const childEnergy = Math.ceil(Math.random() * entity.props.energy);
        entity.props.energy -= childEnergy;
        view.put(space, plantBuilder.build({energy: childEnergy}));
        return STOP;
      } else {
        return GROW;
      }
    }
);

/**
 * To structure more complex entity behaviour, we can use a {@link BehaviourGraph}
 * to split it up in different subbehaviours.
 * Every behaviour returns an action, which tells the graph which behaviour to call next.
 *
 * The resulting action of a behaviour depends on the properties of an entity.
 * See for example the {@link starting} behaviour of plants:
 * - when a plant has much energy, it will try to clone itself;
 * - and otherwise it will simply grow and increase its energy.
 *
 * The graph always starts with the starting behaviour and ends with the stopping behaviour.
 */
export const plantBehaviour = new BehaviourGraph<Plant>(starting, stopping);
plantBehaviour.add(growing);
plantBehaviour.add(cloning);

plantBehaviour.link(starting, GROW, growing);
plantBehaviour.link(starting, CLONE, cloning);
plantBehaviour.link(growing, STOP, stopping);
plantBehaviour.link(cloning, GROW, growing);
plantBehaviour.link(cloning, STOP, stopping);

console.log('Plant behaviour graph in mermaid format:\n', plantBehaviour.toString());
