import * as fs from 'fs';
import logUpdate from 'log-update';
import {Entity, EntityBuilderMap, EntityHandler, EntityHandlerMap, EntityProps, Neighbours, Vector, World} from 'pixcellular';

if (!process.argv[2]) {
  throw new Error('usage: npm run start [path-to-map]');
}

// Map of our world:
const map = JSON.parse(fs.readFileSync(process.argv[2]).toString());

type CellProps = EntityProps & { previousSymbol?: string };
class Cell implements Entity {
  public props: CellProps;
  public symbol: string;

  constructor(props: CellProps, symbol: string) {
    this.symbol = symbol;
    this.props = props;
  }
}

// Factory that will convert the map into entities:
const builders = new EntityBuilderMap();
builders.add('.', {build: (props) => new Cell(props as CellProps, '.')});
builders.add('o', {build: (props) => new Cell(props as CellProps, 'o')});

// Define behaviour of entities:
const handlers = new EntityHandlerMap();
class CellHandler implements EntityHandler {
  public handle(entity: Entity, location: Vector, world: World): void {
    const cellProps = entity.props as CellProps;
    cellProps.previousSymbol = entity.symbol;

    const view = new Neighbours(world, location);
    const livingNeighbours = view.findDirs(e => {
      // e.handled is set and reset by world.turn:
      return e.handled
        ? (e.props as CellProps).previousSymbol === 'o'
        : e.symbol === 'o';
    });

    const livingCell = entity.symbol === 'o';
    if (!livingCell && livingNeighbours.length === 3) {
      // Start living:
      entity.symbol = 'o';
    } else if (livingCell && (livingNeighbours.length < 2 || livingNeighbours.length > 3)) {
      // Die:
      entity.symbol = '.';
    }
  }
}
handlers.add('.', new CellHandler());
handlers.add('o', new CellHandler());

const world = new World({map, entityProps: [], builders, handlers});

setInterval(() => {
  logUpdate(world.turn().toString());
}, 100);

process.on('SIGINT', () => process.exit());
