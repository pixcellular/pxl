import Entity from './Entity';
import {EntityHandler} from './EntityHandler';
import {EntityProps} from './EntityProps';

/**
 * Create Entity with props
 */
export type EntityBuilder = (props: EntityProps) => Entity;

/**
 * Create an Entity by its symbol
 */
export class EntityFactory {

  private entities: Record<string, EntityBuilder>;

  constructor() {
    this.entities = {};
  }

  public add(symbol: string, handler: EntityBuilder) {
    if (this.entities[symbol]) {
      throw new Error(`Symbol '${symbol}' already has an entity handler`);
    }
    this.entities[symbol] = handler;
  }

  public get(symbol: string): EntityBuilder {
    const entityHandler = this.entities[symbol];
    if (!entityHandler) {
      throw new Error(`No entity builder found for symbol '${symbol}'`);
    }
    return entityHandler;
  }

}
