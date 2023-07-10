import {Action, Behaviour, BehaviourGraph, View, World} from 'pixcellular';
import {Plant, plantBuilder} from './Plant';
import {SPACE} from './Symbols';

const STOP = new Action('stop');
const GROW = new Action('grow');
const CLONE = new Action('clone');
const NOOP = new Action('');

const starting = new Behaviour<Plant>(
    'starting',
    (action: Action, entity: Plant, world: World): Action => {
      if (entity.props.energy > 40) {
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
      entity.props.energy++;
      return STOP;
    }
);

const cloning = new Behaviour<Plant>(
    'cloning',
    (action: Action, entity: Plant, world: World): Action => {
      const view = new View(world, entity.props.location);
      const space = view.findRand(e => e.symbol === SPACE);
      if (space) {
        const childEnergy = Math.ceil(Math.random() * entity.props.energy);
        entity.props.energy -= childEnergy;
        view.set(space, plantBuilder.build({energy: childEnergy}));
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

console.log('Behaviour graph in mermaid format:', plantBehaviour.toString());
