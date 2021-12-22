const map = [
    '     ',
    '     ',
    '  o  ',
    '     ',
    '     ',
];

// Turn map into entities:
const entityFactory = new pxl.EntityFactory();
const space = {symbol: ' '};
entityFactory.add(' ', () => space);
entityFactory.add('o', (props) => { return {symbol: 'o', handled: false, props}});

// Define properties of entity:
const organismProps = {location: new pxl.Vector(2, 2), age: 0, energy: 50};
const entityProps = [organismProps];

// Define their behaviour:
const entityHandler = new pxl.EntityHandlerMap()
entityHandler.add(' ', {handle: () => null});
entityHandler.add('o', {
    handle: (organism, location, world) => {
        // Get neighbours:
        const view = new pxl.View(world, location);

        // Find random empty space:
        const direction = view.find(' ');
        const destination = location.plus(direction.toVector());

        // Move:
        world.getGrid().set(location, space);
        world.getGrid().set(destination, organism);

        // Update props:
        organism.props.age ++;
        organism.props.energy -= 1;

        if(organism.props.energy <= 0) {
            // Die:
            world.getGrid().set(destination, space);
        }
    }
});

const world = new pxl.World(map, entityFactory, entityProps, entityHandler)

const interval = setInterval(() => {
    document.getElementById('grid').innerText = world.turn().toString();
    console.log(`age=${organismProps.age}; energy=${organismProps.energy}`);
    if(organismProps.energy <= 0) {
        clearInterval(interval);
    }
}, 100);
