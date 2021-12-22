import Vector from './Vector';

export class EntityProps {
  public location: Vector;
  public startLocation?: Vector;

  constructor(location: Vector) {
    this.location = location;
  }
}
