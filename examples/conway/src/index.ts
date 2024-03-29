import * as fs from 'fs';
import logUpdate from 'log-update';
import {Entity, EntityBuilderMap, EntityProps, Neighbours, Vector, World} from 'pixcellular';

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

  public handle = (location: Vector, world: World) => {
    const cellProps = this.props as CellProps;
    cellProps.previousSymbol = this.symbol;

    const view = new Neighbours(world.getGrid(), location);
    const livingNeighbours = view.findDirs(e => {
      // e.handled is set and reset by world.turn:
      return e.handled
          ? (e.props as CellProps).previousSymbol === 'o'
          : e.symbol === 'o';
    });

    const livingCell = this.symbol === 'o';
    if (!livingCell && livingNeighbours.length === 3) {
      // Start living:
      this.symbol = 'o';
    } else if (livingCell && (livingNeighbours.length < 2 || livingNeighbours.length > 3)) {
      // Die:
      this.symbol = '.';
    }
  }
}

// Factory that will convert the map into entities:
const builders = new EntityBuilderMap();
builders.add('.', {build: (props) => new Cell(props as CellProps, '.')});
builders.add('o', {build: (props) => new Cell(props as CellProps, 'o')});

// Define behaviour of entities:
const world = new World({map, entityProps: [], builders});

setInterval(() => {
  logUpdate(world.turn().toString());
}, 100);

process.on('SIGINT', () => process.exit());
