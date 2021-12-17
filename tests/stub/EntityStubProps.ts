import Direction, {E} from '../../src/Direction';
import {EntityProps} from '../../src/EntityProps';
import Vector from '../../src/Vector';

export class EntityStubProps extends EntityProps {
  public dir: Direction;
  public location: Vector;
  public energy: number;
}
