import {EntityBuilderMap, EntityHandler, EntityHandlerMap, EntityProps, Vector, World} from 'pixcellular';
import {Plant, plantBuilder} from './Plant';
import {plantBehaviour} from './PlantBehaviour';
import {PlantProps} from './PlantProps';
import {PLANT, SPACE} from './Symbols';

type HerbivoreProps = EntityProps & {
  energy: number
};

export default class App {
  public run() {
    console.log('run');

    const map = [
      '...',
      '.#.',
      '...'
    ];

    const space = {} as EntityProps;
    const plants: PlantProps[] = [
      {location: new Vector(1, 1), energy: 10}
    ];

    // Factory that will convert the map into entities:
    const builder = new EntityBuilderMap();
    builder.add(SPACE, {build: (props) => ({symbol: SPACE, props: space})});

    builder.add(PLANT, plantBuilder);

    // Define behaviour of entities:
    const handlers = new EntityHandlerMap();

    class PlantHandler implements EntityHandler {
      public handle(entity: Plant, location: Vector, world: World): void {
        plantBehaviour.traverse(entity, world);
      }
    }

    handlers.add(SPACE, {
      handle: () => {
      }
    });

    handlers.add(PLANT, new PlantHandler());

    const world = new World(map, plants, builder, handlers);
    setInterval(() => {
      world.turn();
      const currentPlants = [];
      world.getGrid().forEachCell(e => {
        if (e.symbol === PLANT) {
          currentPlants.push(e.props);
        }
      });
      console.log('turn', world.age, 'plants', currentPlants);
      document.getElementById('grid').innerText = world.getGrid().toString();
    }, 250);
  }
}
