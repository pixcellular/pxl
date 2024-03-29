import {EntityBuilderMap, World, WorldMap} from 'pixcellular';
import {herbivoreBehaviour} from './HerbivoreBehaviour';
import {HerbivoreBuilder} from './HerbivoreBuilder';
import {HerbivoreMapBuilder} from './HerbivoreMapBuilder';
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
  private mapBuilder = new HerbivoreMapBuilder(200, 100);

  public run() {
    this.displayOnCreateClick(new StoreForm());
    const map = this.mapBuilder.build();
    this.displayWorld(createWorld(map));
  }

  private displayOnCreateClick(
      storeForm: StoreForm
  ) {
    this.$createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      storeForm.updateStore();
      const map = this.mapBuilder.build();
      this.displayWorld(createWorld(map));
    });
  }

  private displayWorld(world) {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }
    this.currentInterval = setInterval(() => {
      const start = performance.now();
      world.turn();
      console.log('turn took', (performance.now() - start).toFixed(0));
      this.displayWorldOnce(world);
    }, store.loopDurationMs);
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

function createWorld(map: WorldMap) {

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
