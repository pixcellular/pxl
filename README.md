# Pixcellular

A small grid framework to set up cellular automata.

## Introduction
With Pixcellular (or pxl for short) we can model a world filled with organisms, each organism containing specific properties and a specific set of behavioural rules.

To create a new pxl `World` we pass it a _map_ in which every _symbol_ marks an _entity_. Each entity has properties and each symbol has specific behavioural rules.

```js
const map = [
  'o    ',
  '  o  ',
  '     '
];
const space = {};
const organisms = [
  { location: new Vector(0, 0), energy: 10 },
  { location: new Vector(1, 1), energy: 20 }
];
```

In the map above the `o` marks two entities with two properties: a required `location` property, and the energy level of an organism.
You can give any symbol any property you want. Also, space is an entity, albeit without any properties: all space is the same.

Pxl needs to convert the array map and the entity properties into a world with acting entities.
You can do this with an `EntityFactory`. 

Note: entity properties need a `location`. Pxl will use it to map the symbols on the map to their properties. Space does not need a location because all space properties are the same (i.e. an empty object).
```js
const entityFactory = new EntityFactory();

// Space stays space:
entityFactory.add(' ', (props) => ({symbol: ' ', space}));

// Every entity can have its own properties:
entityFactory.add('o', (props) => ({symbol: 'o', props}));
```

All entities behave in a certain way. For 'space' it is simple: do nothing. But for the `o` organism we might want to define a specific set of behavioural rules. Pxl uses an `EntityHandler` to determine the behaviour of every entity.

```js
const entityHandler = new EntityHandlerMap();

// Space does nothing:
entityHandler.add(' ', { handle: () => null });

// Organisms behave according to specific rules:
entityHandler.add('o', {
  handle: (organism, location, world) => {
    // Get neighbouring cells:
    const view = new View(world, location);

    // Find random empty space:
    const direction = view.findRand(e => e.symbol === ' ');

    // Move randomly:
    view.move(direction);

    // Moving costs energy:
    organism.props.energy--;

    // No energy means death:
    if (organism.props.energy <= 0) {
      view.set(direction, space);
    }
  }
});
```

Now, lets pull all these building blocks together into a single world:
```js
const world = new World(map, entityFactory, organisms, entityHandler);
```

And finally, lets make the world turn:
```js
while (organisms.find(e => e.energy)) {
  console.log(world.turn().toMap());
}
```


## Examples
- [Introduction](https://github.com/pixcellular/pxl/blob/main/examples/introduction/index.html) (Javascript)
- [Minimal browser example](https://github.com/pixcellular/pxl/blob/main/examples/vanilla/index.html) (Javascript)
- [Conway's Game of Life](https://github.com/pixcellular/pxl/blob/main/examples/conway/README.md) (Typescript)

## Development

### Prepare
Run: `npm i`

### Test
Run: `npm t`

## Publish
Run: `npm run build && npm run publish:dist`
