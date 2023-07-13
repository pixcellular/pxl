# Pixcellular

Pixcellular (pxl) is a small grid framework to create cellular automata and world simulations in typescript and javascript. 

- The basics are explained in the [introduction](#introduction)
- Working code can be found in the [examples](https://github.com/pixcellular/pxl/blob/main/examples/README.md)
- Bugs or unsolvable questions? Please create an [issue](https://github.com/pixcellular/pxl/issues).
- Want to contribute? :D See [development](#development)

## Introduction
With Pixcellular we can model a world filled with organisms, each organism containing specific properties and a specific set of behavioural rules.

### Map the world
To create a new pxl _world_ we pass it a _map_ in which every _symbol_ marks an _entity_.

```js
const map = [
  'o  ',
  ' o ',
  '   '
];
```

Every entity on our map can have properties:
```js
const space = {};
const organisms = [
  {location: new Vector(0, 0), energy: 10},
  {location: new Vector(1, 1), energy: 20}
];
```

In the map above the `o` marks two entities with two properties: a required `location` property, and the energy level of an organism.
You can give any symbol any property you want. Also, space is an entity, albeit without any properties: all space is the same.

Note: entity properties need a `location`. Pxl will use it to map the symbols on the map to their properties. Space does not need a location because all space properties are the same (i.e. an empty object).

### Build entities
Pxl converts the map and properties into a world with acting entities. It does this using `EntityBuilder`s:

```js
const builders = new EntityBuilderMap();

// Space stays space:
builders.add(' ', {build: (props) => ({symbol: ' ', space})});

// Every entity can have its own props:
builders.add('o', {build: (props) => ({symbol: 'o', props})});
```

Note: in this example all spaces share the same `space` props, but every organism is created using its own unique properties. 

###  Define behaviour
All entities behave in a certain way. For 'space' it is simple: do nothing. But for the `o` organism we might want to define a specific set of behavioural rules. Pxl uses `EntityHandler`s to determine the behaviour of every symbol:

```js
const handlers = new EntityHandlerMap()

// Space does nothing:
handlers.add(' ', {handle: () => {}});

// Organisms behave according to specific rules:
handlers.add('o', {
  handle: (organism, location, world) => {
    // Current location plus neighbouring cells:
    const view = new Neighbours(world, location);

    // Find a random empty cell:
    const direction = view.findDirRand(e => e.symbol === ' ');

    // Move the entity:
    view.move(direction);

    // However, moving is costly:
    organism.props.energy--;

    // ... and no energy means death:
    if (organism.props.energy <= 0) {
      const newSpace = builders.get(' ').build(space);
      view.set(direction, newSpace);
    }
  }
});
```

### Start simulation
Finally, we can put all these building blocks together:

```js
const world = new World({map, entityProps: organisms, builders, handlers})
```

Let's make the world go round:
```js
while (organisms.find(e => e.energy)) {
  console.log(world.turn().toMap());
}
```

### Complex behaviour

This is a very simple example, and you probably want to give your entities more complex behaviour. 
To prevent outrageously unreadable handler functions, pxl offers a way to divide your behaviour into smaller parts using a `BehaviourGraph`. 
You can find an example including documented code in the [herbivore](https://github.com/pixcellular/pxl/blob/main/examples/herbivore/README.md) example.

## Development

### Prepare
Run: `npm i`

### Test
Run: `npm t`

