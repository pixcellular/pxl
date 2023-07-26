# Herbivore example

A more complete example containing a `BehaviourGraph` to organize morge complex entity behaviour and a `MapBuilder` to generate maps using Perlin noise.

## 1. Behaviour graph
To structure the behaviour of your entities, pxl offers the `BehaviourGraph`, a directional graph consisting of `Behaviour` nodes, linked by `Action`s. Each behaviour leads to an `Action` link, which leads to another `Behaviour`. From one behaviour to the next, we _traverse_ our network of behaviours.

### Interesting files:
- `src/PlantBehaviour`: defines the behaviour graph of our plant entities
- `src/HerbivoreBehaviour`: defines the behaviour graph of our plant entities

## 2. Building maps
To generate maps pxl offers a MapBuilder interface and an implementation using [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise). 

### Interesting files:
- `src/HerbivoreMapBuilder`: implements a custom map builder using the `PerlinMapBuilder`

## First time
```shell
npm install
```

## Run
```shell
npm run build
```

... and open `./dist/index.html` in your browser.
