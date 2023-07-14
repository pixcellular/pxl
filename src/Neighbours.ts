import Direction, {cardinalDirections} from './Direction';
import Entity from './Entity';
import randomIndex from './util/randomIndex';
import Vector from './Vector';
import View from './View';
import World from './World';

/**
 * A limited perspective of 1 cell in all directions
 */
export default class Neighbours implements View {
  private world: World;
  private centre: Vector;

  constructor(world: World, centre: Vector) {
    if (!centre) {
      throw new Error('Location not set');
    }
    this.world = world;
    this.centre = centre;
  }

  public getCentre(): Vector {
    return this.centre;
  }

  public get(dir: Direction): Entity | null {
    const target = this.centre.plus(dir);
    if (this.world.getGrid().contains(target)) {
      return this.world.getGrid().get(target);
    }
    return null;
  }

  public put(dir: Direction, entity: Entity) {
    const target = this.centre.plus(dir);
    return this.world.getGrid().put(target, entity);
  }

  public findDir(predicate: (e: Entity) => boolean): Direction | null {
    for (const dir of cardinalDirections) {
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        return dir;
      }
    }
    return null;
  }

  public findDirs(predicate: (e: Entity) => boolean): Direction[] {
    const found = [];
    for (const dir of cardinalDirections) {
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        found.push(dir);
      }
    }
    return found;
  }

  public findDirRand(predicate: (e: Entity) => boolean): Direction | null {
    const offset = randomIndex(cardinalDirections as []);
    for (let i = 0; i < cardinalDirections.length; i++) {
      const pointer = (i + offset) % cardinalDirections.length;
      const dir = cardinalDirections[pointer];
      const entity = this.get(dir);
      if (entity && predicate(entity)) {
        return dir;
      }
    }
    return null;
  }

  public remove(dir: Direction): Entity | null {
    const target = this.centre.plus(dir);
    return this.world.getGrid().remove(target);
  }

}
