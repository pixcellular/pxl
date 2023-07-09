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
      if (!space) {
        return GROW;
      } else {
        const splitEnergy = Math.floor(entity.props.energy / 2);
        entity.props.energy = splitEnergy;
        view.set(space, plantBuilder.build({energy: splitEnergy}));
        return STOP;
      }
    }
);

/**
 * To structure more complex entity behaviour, we can use a {@link BehaviourGraph} to split up the different behaviours.
 * Every behaviour returns an action, which tells the graph which behaviour to call next.
 *
 * The outcome of a behaviour differs on the properties of an entity.
 * See for example the {@link starting} behaviour of plants:
 * - when a plant has much energy, it will try to clone itself;
 * - and otherwise it will simply grow and increase its energy.
 *
 * The graph always starts with the starting behaviour and ends with the stopping behaviour
 */
export const plantBehaviour = new BehaviourGraph<Plant>(starting, stopping);
plantBehaviour.add(growing);
plantBehaviour.add(cloning);

plantBehaviour.link(starting, GROW, growing);
plantBehaviour.link(starting, CLONE, cloning);
plantBehaviour.link(growing, STOP, stopping);
plantBehaviour.link(cloning, GROW, growing);
plantBehaviour.link(cloning, STOP, stopping);

console.log('behaviour:\n', plantBehaviour.toString(), '\n plot in https://dreampuf.github.io/GraphvizOnline');
