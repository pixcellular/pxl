# Herbivore example

To structure the behaviour of your entities, pxl offers the `BehaviourGraph`, a directional graph consisting of `Behaviour` nodes, linked by `Action`s. Each behaviour leads to an `Action` link, which leads to another `Behaviour`. From one behaviour to the next, we _traverse_ our network of behaviours.

## Interesting files:
- `src/App`: builds our world
- `src/PlantBehaviour`: defines the behaviour graph of our plant entities

## First time
```shell
npm install
```

## Run
```shell
npm run build
```

... and open `./dist/index.html` in your browser.
