import {EntityProps} from '../../src';
import Direction, {NONE} from '../../src/Direction';
import Vector from '../../src/Vector';

export class EntityStubProps extends EntityProps {

  public dir: Direction = NONE;
  public location: Vector;
  public energy: number;

  constructor(location: Vector, dir: Direction, energy: number) {
    super(location);
    this.dir = dir;
    this.location = location;
    this.energy = energy;
  }
}
