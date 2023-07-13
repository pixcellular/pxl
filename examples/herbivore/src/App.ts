import {EntityBuilderMap, EntityHandler, EntityHandlerMap, Vector, World} from 'pixcellular';
import {Herbivore} from './Herbivore';
import {herbivoreBehaviour} from './HerbivoreBehaviour';
import {HerbivoreBuilder} from './HerbivoreBuilder';
import {Plant} from './Plant';
import {plantBehaviour} from './PlantBehaviour';
import {PlantBuilder} from './PlantBuilder';
import {SpaceBuilder} from './SpaceBuilder';
import {store} from './Store';
import {StoreForm} from './StoreForm';
import {HERBIVORE, PLANT, SPACE, STONE} from './Symbols';

const CREATE_BTN_ID = 'create-world';

export default class App {

  private $grid = document.getElementById('grid');
  private $createBtn = document.getElementById(CREATE_BTN_ID);
  private currentInterval;

  public run() {
    this.displayOnCreateClick(new StoreForm());
    this.displayWorld(createWorld());
  }

  private displayOnCreateClick(
      storeForm: StoreForm
  ) {
    this.$createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      storeForm.updateStore();
      this.displayWorld(createWorld());
    });
  }

  private displayWorld(world) {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }
    this.currentInterval = setInterval(() => {
      world.turn();
      this.displayWorldOnce(world);
    }, 100);
  }

  private displayWorldOnce(world) {
    const currentPlants = [];
    const currentHerbivores = [];
    world.getGrid().forEachCell(e => {
      if (e.symbol === PLANT) {
        currentPlants.push(e.props);
      }
      if (e.symbol === HERBIVORE) {
        currentHerbivores.push(e.props);
      }
    });
    console.log('turn', world.age, {
      grid: world.getGrid(),
      herbivores: currentHerbivores,
      plants: currentPlants
    });
    this.$grid.innerText = world.getGrid().toString();
  }
}

function createWorld() {

  const map = [
    'O#  #   ^',
    '#O    #  ',
    ' #  #    ',
    '    #    ',
    '    #O   ',
    ' ^   # ##',
    ' #  # ##O',
    '# ##  # #',
    '     #   '
  ];

  // Factory that will convert the map into entities:
  const builders = new EntityBuilderMap();

  builders.add(SPACE, new SpaceBuilder());
  builders.add(STONE, {build: () => ({symbol: STONE, props: {}})});
  builders.add(PLANT, new PlantBuilder({energy: 20}));
  builders.add(HERBIVORE, new HerbivoreBuilder(store.herbivoreInitialEnergy));

  // Define behaviour of entities:
  const handlers = new EntityHandlerMap();

  class PlantHandler implements EntityHandler {
    public handle(entity: Plant, location: Vector, world: World): void {
      /**
       * Plant behaviour will be generated by a behaviour graph
       * See: {@link plantBehaviour} for details
       */
      plantBehaviour.traverse(entity, world);
    }
  }

  class HerbivoreHandler implements EntityHandler {
    public handle(entity: Herbivore, location: Vector, world: World): void {
      /**
       * Herbivore behaviour will be generated by a behaviour graph
       * For introduction, see {@link plantBehaviour}
       * For more complex herbivore behaviour, see {@link herbivoreBehaviour}
       */
      herbivoreBehaviour.traverse(entity, world);
    }
  }

  handlers.add(SPACE, {handle: noop});
  handlers.add(STONE, {handle: noop});
  handlers.add(PLANT, new PlantHandler());
  handlers.add(HERBIVORE, new HerbivoreHandler());

  return new World({map, entityProps: [], builders, handlers});
}

function noop() {
}
