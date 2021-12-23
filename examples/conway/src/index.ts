import * as fs from 'fs';
import logUpdate from 'log-update';
import {Entity, EntityFactory, EntityHandler, EntityHandlerMap, EntityProps, Vector, View, World} from 'pixcellular';

if (!process.argv[2]) {
  throw new Error('usage: npm run start [path-to-map]')
}
const map = JSON.parse(fs.readFileSync(process.argv[2]).toString());

type CellProps = EntityProps & { previousSymbol?: string };

class Cell implements Entity {
  public handled: boolean = false;
  public props: CellProps;
  public symbol: string;

  constructor(props: CellProps, symbol: string) {
    this.symbol = symbol;
    this.props = props;
  }
}

const entityFactory = new EntityFactory();
entityFactory.add('.', (props) => new Cell(props as CellProps, '.'));
entityFactory.add('o', (props) => new Cell(props as CellProps, 'o'));

class CellHandler implements EntityHandler {
  public handle(entity: Entity, location: Vector, world: World): void {
    let cellProps = entity.props as CellProps;
    cellProps.previousSymbol = entity.symbol;

    const view = new View(world, location);
    const livingNeighbours = view.filter(e => e.handled
      ? (e.props as CellProps).previousSymbol === 'o'
      : e.symbol === 'o'
    );

    const livingCell = entity.symbol === 'o';
    if(!livingCell && livingNeighbours.length === 3) {
      // Start living:
      entity.symbol = 'o';
    } else if (livingCell && livingNeighbours.length < 2 || livingNeighbours.length > 3) {
      // Die:
      entity.symbol = '.';
    }
  }
}

const entityHandlerMap = new EntityHandlerMap();
entityHandlerMap.add('.', new CellHandler());
entityHandlerMap.add('o', new CellHandler());

const world = new World(map, entityFactory, [], entityHandlerMap);

setInterval(() => {
  logUpdate(world.turn().toString());
}, 100);