import Entity from './Entity';
import Vector from './Vector';
import World from './World';

/**
 * Define entity behaviour
 */
export interface EntityHandler {
  handle(entity: Entity, location: Vector, world: World): void;
}

/**
 * Map entity symbol to its handler
 */
export class EntityHandlerMap {

  /**
   * EntityHandlers by symbol
   */
  private handlers: Record<string, EntityHandler>;

  constructor() {
    this.handlers = {};
  }

  public add(symbol: string, handler: EntityHandler) {
    if (this.handlers[symbol]) {
      throw new Error(`Symbol '${symbol}' already has an entity handler`);
    }
    this.handlers[symbol] = handler;
  }

  public get(symbol: string): EntityHandler {
    const entityHandler = this.handlers[symbol];
    if (!entityHandler) {
      throw new Error(`No entity handler found for symbol '${symbol}'`);
    }
    return entityHandler;
  }

}

