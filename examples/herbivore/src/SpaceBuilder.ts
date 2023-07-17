import {SPACE} from './Symbols';

export class SpaceBuilder {
  public build() {
    return {symbol: SPACE, props: {}, handle: () => null};
  }

}
