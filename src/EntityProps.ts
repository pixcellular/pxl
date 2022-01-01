import Vector from './Vector';

/**
 * Properties of an {@link Entity}
 */
export class EntityProps {

  /**
   * Location links properties to a symbol on the map
   * Props.location is kept in sync grid location
   */
  public location?: Vector;

  constructor(location?: Vector) {
    this.location = location;
  }
}
