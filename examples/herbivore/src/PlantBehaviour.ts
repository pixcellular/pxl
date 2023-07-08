import {Action, Entity, NONE, Rule, RuleGraph, SE, View, World} from 'pixcellular';
import {Plant, plantBuilder} from './Plant';
import {PlantProps} from './PlantProps';
import {SPACE} from './Symbols';

// TODO:
//  - RuleGraph should look like:
//    export const plantBehaviour = new RuleGraph(entryRule, exitRule);
//  - Grid should have field that contains all entities

class EntryRule implements Rule {
  private toReturn: Action;

  constructor(toReturn: Action) {
    this.toReturn = toReturn;
  }

  public enforce(action: Action, entity: Entity, world: World): Action {
    return this.toReturn;
  }
}

class GrowRule implements Rule {
  public enforce(action: Action, entity: Plant, world: World): Action {
    entity.props.energy++;
    return new Action('clone', NONE);
  }
}

class CloneRule implements Rule {
  public enforce(action: Action, entity: Plant, world: World): Action {
    if (entity.props.energy > 20) {
      const view = new View(world, entity.props.location);
      const space = view.findRand(e => e.symbol === SPACE);
      if (space) {
        const splitEnergy = Math.floor(entity.props.energy / 2);
        entity.props.energy = splitEnergy;
        view.set(space, plantBuilder.build({energy: splitEnergy} as PlantProps));
      }
    }
    return new Action('exit', NONE);
  }
}

const entryRuleName = 'entryRule';
const exitActionType = 'exit';

const plantEntryRule = new EntryRule(new Action('grow', NONE));
export const plantBehaviour = new RuleGraph(entryRuleName, plantEntryRule, exitActionType);

const growRuleName = 'growRule';
plantBehaviour.addNode(growRuleName, new GrowRule());
const cloneRuleName = 'cloneRule';
plantBehaviour.addNode(cloneRuleName, new CloneRule());

plantBehaviour.addLink(entryRuleName, 'grow', growRuleName);
plantBehaviour.addLink(growRuleName, 'clone', cloneRuleName);
plantBehaviour.addLink(cloneRuleName, exitActionType);

console.log(plantBehaviour.toString());
