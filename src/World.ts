import Entity from './Entity';
import {EntityFactory} from './EntityFactory';
import {EntityHandlerMap} from './EntityHandler';
import {EntityProps} from './EntityProps';
import Grid from './Grid';
import Vector from './Vector';

/**
 * Inspired by: https://eloquentjavascript.net/2nd_edition/07_elife.html
 */
export default class World {

  private readonly grid: Grid;
  private readonly entityHandlers: EntityHandlerMap;

  /**
   * World containing a grid populated with entities
   *
   * @param map matrix with element symbols
   * @param entityFactory Array of elements
   * @param entityProps elements as found in team.members
   * @param entityHandlers symbolHandler
   */
  constructor(
    map: string[],
    entityFactory: EntityFactory,
    entityProps: EntityProps[],
    entityHandlers: EntityHandlerMap
  ) {
    this.entityHandlers = entityHandlers;
    this.grid = this.mapToGrid(map, entityProps, entityFactory);
  }

  public mapToGrid(plan: string[], entityProps: EntityProps[], entityBuilders: EntityFactory): Grid {
    const grid = new Grid(plan[0].length, plan.length);
    plan.forEach((line, y) => {
      for (let x = 0; x < line.length; x++) {
        const location = new Vector(x, y);
        let props = entityProps.find((p) => {
          return p.location.x === x && p.location.y === y;
        });
        if (props) {
          props.startLocation = location;
        } else {
          props = {location};
        }
        const element = entityBuilders.get(line[x])(props);
        grid.set(location, element);
      }
    });
    return grid;
  }

  /**
   * Make the world turn one round
   */
  public turn(): Grid {
    this.grid.unhandle();
    this.grid.forEachCell((entity: Entity, location: Vector) => {
      if (entity.handled) {
        return;
      }
      const handler = this.entityHandlers.get(entity.symbol);
      handler.handle(entity, location, this);
      entity.handled = true;
    });
    return this.grid;
  }

  public getGrid(): Grid {
    return this.grid;
  }

}
