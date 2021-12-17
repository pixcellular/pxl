import Entity from './Entity';
import Vector from './Vector';
import World from './World';

/**
 * Map entity symbol to its handler
 */
export class EntityHandlerMap {

  /**
   * EntityHandlers by symbol
   */
  private entities: Record<string, EntityHandler>;

  constructor() {
    this.entities = {};
  }

  public add(symbol: string, handler: EntityHandler) {
    if (this.entities[symbol]) {
      throw new Error(`Symbol '${symbol}' already has an entity handler`);
    }
    this.entities[symbol] = handler;
  }

  public get(symbol: string): EntityHandler {
    const entityHandler = this.entities[symbol];
    if (!entityHandler) {
      throw new Error(`No entity handler found for symbol '${symbol}'`);
    }
    return entityHandler;
  }

}

export interface EntityHandler {
  handle(entity: Entity, vector: Vector, world: World);
}
