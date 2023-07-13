import Entity from './Entity';
import {EntityBuilderMap} from './EntityBuilder';
import {EntityHandlerMap} from './EntityHandler';
import {EntityProps} from './EntityProps';
import Grid from './Grid';
import {SPACE} from './Space';
import Vector from './Vector';

export type WorldConfig = {
  /**
   * Matrix with entity symbols
   */
  map: string[],

  /**
   * Elements as found in team.members
   */
  entityProps: EntityProps[],

  /**
   * Array of entity builders
   */
  builders: EntityBuilderMap,

  /**
   * Map of {@link EntityHandler}s
   */
  handlers: EntityHandlerMap

  /**
   * Entity on map that is used to fill up empty space.
   * Singleton with a symbol, the same props and no location,
   * i.e. only one defaultEntity exists.
   *
   * defaults to {@link SPACE}
   */
  defaultEntity?: Entity
};

/**
 * Inspired by: https://eloquentjavascript.net/2nd_edition/07_elife.html
 */
export default class World {

  private readonly grid: Grid;
  private readonly entityHandlers: EntityHandlerMap;
  private defaultEntity: Entity = SPACE;

  /**
   * Turns that have passed since start of world
   */
  private _age = 0;

  /**
   * World containing a grid populated with entities
   */
  constructor(
      config: WorldConfig
  ) {
    this.entityHandlers = config.handlers;
    this.initDefaultEntity(config);
    this.grid = this.mapToGrid(config);
  }

  public mapToGrid(config: WorldConfig): Grid {
    const grid = new Grid(
        config.map[0].length,
        config.map.length,
        this.defaultEntity
    );
    grid.forEachCell((_: Entity, location: Vector) => {
      const foundProps = config.entityProps.find((p) => {
        return p && p.location && p.location.x === location.x && p.location.y === location.y;
      });
      const props = foundProps || new EntityProps(location);
      const mapSymbol = config.map[location.y][location.x];
      const entity = config.builders.get(mapSymbol).build(props);
      grid.put(location, entity);
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

  private initDefaultEntity(config: WorldConfig) {
    if (config.defaultEntity) {
      this.defaultEntity = config.defaultEntity;
    }
    if (!config.builders.includes(this.defaultEntity.symbol)) {
      config.builders.add(this.defaultEntity.symbol, {build: () => this.defaultEntity});
    }
    if (!config.handlers.includes(this.defaultEntity.symbol)) {
      config.handlers.add(this.defaultEntity.symbol, {handle: () => {}});
    }
  }

}
