import {EntityBuilderMap, World} from 'pixcellular';
import {herbivoreBehaviour} from './HerbivoreBehaviour';
import {HerbivoreBuilder} from './HerbivoreBuilder';
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
  builders.add(STONE, {build: () => ({symbol: STONE, props: {}, handle: () => null})});
  builders.add(PLANT, new PlantBuilder({energy: 20}, plantBehaviour));
  builders.add(HERBIVORE, new HerbivoreBuilder(store.herbivoreInitialEnergy, herbivoreBehaviour));

  return new World({map, entityProps: [], builders});
}

function noop() {
}
