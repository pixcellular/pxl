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
const organisms = [
  {location: new Vector(0, 0), energy: 10},
  {location: new Vector(1, 1), energy: 20}
];
```

In the map above the `o` marks two entities with two properties: a required `location` property, and the energy level of an organism.
You can give any symbol any property you want. Also, space is an entity, albeit without any properties: all space is the same.

Note: entity properties need a `location`. Pxl will use it to map the symbols on the map to their properties. Space does not need a location because all space properties are the same (i.e. an empty object).

###  Define behaviour

All entities behave in a certain way. For 'space' it is simple: do nothing. But for the `o` organism we might want to define a specific set of behavioural rules. Pxl uses the `Entity.handle` function to determine the behaviour of every symbol:

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

### Build entities

Pxl converts the map and properties into a world with acting entities. It does this using `EntityBuilder`s:

```js
const builders = new EntityBuilderMap();

// Every entity can have its own props:
builders.add('o', {build: (props) => ({symbol: 'o', props})});
```

Note: in this example all spaces share the same `space` props, but every organism is created using its own unique properties. 

### Start simulation
Finally, we can put all these building blocks together:

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

### Complex behaviour

This is a very simple example, and you probably want to give your entities more complex behaviour. 
To prevent outrageously unreadable handler functions, pxl offers a way to divide your behaviour into smaller parts using a `BehaviourGraph`. 
You can find an example including documented code in the [herbivore](https://github.com/pixcellular/pxl/blob/main/examples/herbivore/README.md) example.

## Development

### Prepare
Run: `npm i`

### Test
Run: `npm t`

