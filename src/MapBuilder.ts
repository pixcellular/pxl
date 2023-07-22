import {WorldMap} from './WorldMatrix';

export interface MapBuilder {
  build(): WorldMap;
}
