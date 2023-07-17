import {Behaviour, BehaviourGraph, BehaviourName, Neighbours, World} from 'pixcellular';
import {CLONE, GROW, START} from './Behaviours';
import {Plant} from './Plant';
import {PlantBuilder} from './PlantBuilder';
import {store} from './Store';
import {SPACE} from './Symbols';

const starting = new Behaviour<Plant>(
    START,
    (entity: Plant): BehaviourName => {
      if (entity.props.energy > store.plantCloneThreshold) {
        return CLONE;
      } else {
        return GROW;
      }
    }, [CLONE, GROW]
);

const growing = new Behaviour<Plant>(
    GROW,
    (entity: Plant): BehaviourName => {
      entity.props.energy += store.plantGrowEnergy;
      return null;
    },
    []
);

const cloning = new Behaviour<Plant>(
    CLONE,
    (entity: Plant, world: World): BehaviourName => {
      const view = new Neighbours(world, entity.props.location);
      const space = view.findDirRand(e => e.symbol === SPACE);
      if (space) {
        const childEnergy = Math.ceil(Math.random() * entity.props.energy);
        entity.props.energy -= childEnergy;
        view.put(space, entity.builder.build({energy: childEnergy}));
        return null;
      } else {
        return GROW;
      }
    },
    [GROW]
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
export const plantBehaviour = new BehaviourGraph<Plant>(starting);
plantBehaviour.add(growing);
plantBehaviour.add(cloning);

console.log('Plant behaviour graph in mermaid format:\n', plantBehaviour.toString());
