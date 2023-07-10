import Entity from './Entity';
import {EntityBuilderMap} from './EntityBuilder';
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
   * Turns that have passed since start of world
   */
  private _age = 0;

  /**
   * World containing a grid populated with entities
   *
   * @param map matrix with entity symbols
   * @param entityProps elements as found in team.members
   * @param entityFactory Array of entity builders
   * @param entityHandlers Map of {@link EntityHandler}s
   */
  constructor(
    map: string[],
    entityProps: EntityProps[],
    entityFactory: EntityBuilderMap,
    entityHandlers: EntityHandlerMap
  ) {
    this.entityHandlers = entityHandlers;
    this.grid = this.mapToGrid(map, entityProps, entityFactory);
  }

  public mapToGrid(plan: string[], entityProps: EntityProps[], entityBuilders: EntityBuilderMap): Grid {
    const grid = new Grid(plan[0].length, plan.length);
    grid.forEachCell((_: Entity, location: Vector) => {
      let props = entityProps.find((p) => {
        return p && p.location && p.location.x === location.x && p.location.y === location.y;
      });
      if (!props) {
        props = new EntityProps();
      }
      const mapSymbol = plan[location.y][location.x];
      const entity = entityBuilders.get(mapSymbol).build(props);
      grid.set(location, entity);
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
    this._age++;
    return this.grid;
  }

  public getGrid(): Grid {
    return this.grid;
  }

  /**
   * Turns that have passed since beginning of world
   */
  get age(): number {
    return this._age;
  }

}
