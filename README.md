# pixcellular/pxl

[![npm version](https://badge.fury.io/js/pixcellular.svg)](https://badge.fury.io/js/pixcellular) ![build](https://github.com/pixcellular/pxl/actions/workflows/build.yml/badge.svg)

Small grid framework to create ecosystem models and simulations.

- The basics are explained in the [introduction](#introduction)
- Working code can be found in [examples](https://github.com/pixcellular/pxl/blob/main/examples/)
- Browser examples are hosted on [pixcellular.github.io/pxl](https://pixcellular.github.io/pxl/)
- Bug, question or suggestion? Please create an [issue](https://github.com/pixcellular/pxl/issues).
- Want to contribute? :D See [development](#development) and our [guidelines](https://github.com/pixcellular/pxl/blob/main/CONTRIBUTING.md).

## Introduction
With pxl we can model a world filled with entities, each entity containing specific properties and a specific set of behavioural rules.

### Mapping the world
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
const organisms = [
  {location: new Vector(0, 0), energy: 10},
  {location: new Vector(1, 1), energy: 20}
];
```

In the map above the `o` marks two entities with two properties: a required `location` property, and the energy level of an organism.
You can give any symbol any property you want.

Note: entity properties need a `location`. Pxl will use it to map the symbols on the map to their properties.

###  Defining behaviour

All entities behave in a certain way. For the `o` organism we can define a specific set of behavioural rules using the `Entity.handle` function:

```js
class MyEntity {
  symbol: 'o';
  props;

  // Organisms behave according to specific rules:
  handle = (location, world) => {
    // Get a view of neighbouring cells:
    const view = new pxl.Neighbours(world, location);

    // Find random empty space:
    const spaceDirection = view.findDirRand(e => e.symbol === ' ');

    if (spaceDirection) {
      // Move randomly:
      view.put(spaceDirection, this);
    }

    // Living costs energy:
    this.props.energy--;

    // ... And no energy means death:
    if (this.props.energy <= 0) {
      // Remove entity from world:
      view.remove(spaceDirection || pxl.ZERO);
    }
  }
}
```

### Building entities

Pxl converts the map and properties into a world with acting entities. It does this using `EntityBuilder`s:

```js
const builders = new EntityBuilderMap();

// Every entity can have its own props:
builders.add('o', {build: (props) => ({symbol: 'o', props})});
```

### Starting simulation
Finally, we can put all our building blocks together:

```js
const world = new World({
  map, 
  entityProps: organisms, 
  builders
});
```

Let's make the world go round:
```js
while (organisms.find(e => e.energy)) {
  console.log(world.turn().toMap());
}
```

### More complex behaviour

This is a very simple example, and you probably want to give your entities more complex behaviour. 
To prevent outrageously unreadable `handler` functions, pxl offers a way to divide your behaviour into smaller parts using a `BehaviourGraph`. 
You can find an example with documented code in the [herbivore](https://github.com/pixcellular/pxl/blob/main/examples/herbivore/README.md) example.

## Generating maps

Instead of creating maps by hand, you might want to generate them with the `PerlinMapBuilder` that uses Perlin noise to populate maps with your symbols. 
You could also create your own implementation of the `MapBuilder` interface.
You can find an example with documented code in the [herbivore](https://github.com/pixcellular/pxl/blob/main/examples/herbivore/README.md) example.

## Development

### Prepare
Run: `npm i`

### Test
Run: `npm t`


