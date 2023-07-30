import {CENTRE, Direction, EntityProps, Vector} from '../../../src';

export class EntityStubProps extends EntityProps {

  public dir: Direction = CENTRE;
  public location: Vector;
  public energy: number;

  constructor(location: Vector, dir: Direction, energy: number) {
    super(location);
    this.dir = dir;
    this.location = location;
    this.energy = energy;
  }
}
