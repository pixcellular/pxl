import Entity from './Entity';
import {EntityProps} from './EntityProps';

/**
 * Create Entity with props
 */
export interface EntityBuilder {
  build: (props: EntityProps) => Entity;
}

/**
 * Create an Entity by its symbol
 */
export class EntityBuilderMap {

  private builders: Record<string, EntityBuilder>;

  constructor() {
    this.builders = {};
  }

  public add(symbol: string, handler: EntityBuilder) {
    if (this.builders[symbol]) {
      throw new Error(`Symbol '${symbol}' already has an entity handler`);
    }
    this.builders[symbol] = handler;
  }

  public get(symbol: string): EntityBuilder {
    const entityHandler = this.builders[symbol];
    if (!this.includes(symbol)) {
      throw new Error(`No entity builder found for symbol '${symbol}'`);
    }
    return entityHandler;
  }

  public includes(symbol: string): boolean {
    return !!this.builders[symbol];
  }

}
