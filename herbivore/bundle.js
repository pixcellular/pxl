(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var pixcellular = {exports: {}};

	(function (module, exports) {
		(function (global, factory) {
			module.exports = factory() ;
		})(commonjsGlobal, (function () {
			var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

			function getDefaultExportFromCjs (x) {
				return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
			}

			var dist = {};

			var BehaviourGraph$1 = {};

			var __extends$1 = (commonjsGlobal$1 && commonjsGlobal$1.__extends) || (function () {
			    var extendStatics = function (d, b) {
			        extendStatics = Object.setPrototypeOf ||
			            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
			            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
			        return extendStatics(d, b);
			    };
			    return function (d, b) {
			        if (typeof b !== "function" && b !== null)
			            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			        extendStatics(d, b);
			        function __() { this.constructor = d; }
			        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
			    };
			})();
			var __spreadArray = (commonjsGlobal$1 && commonjsGlobal$1.__spreadArray) || function (to, from, pack) {
			    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
			        if (ar || !(i in from)) {
			            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			            ar[i] = from[i];
			        }
			    }
			    return to.concat(ar || Array.prototype.slice.call(from));
			};
			Object.defineProperty(BehaviourGraph$1, "__esModule", { value: true });
			BehaviourGraph$1.Behaviour = BehaviourGraph$1.GraphValidationError = void 0;
			var GraphValidationError = /** @class */ (function (_super) {
			    __extends$1(GraphValidationError, _super);
			    function GraphValidationError(report) {
			        return _super.call(this, "Graph not valid: ".concat(JSON.stringify(report))) || this;
			    }
			    return GraphValidationError;
			}(Error));
			BehaviourGraph$1.GraphValidationError = GraphValidationError;
			var Behaviour = /** @class */ (function () {
			    function Behaviour(name, perform, responses) {
			        this.name = name;
			        this.perform = perform;
			        this.responses = responses;
			    }
			    return Behaviour;
			}());
			BehaviourGraph$1.Behaviour = Behaviour;
			/**
			 * Directed graph of behaviours, one behaviour resulting in the next,
			 * is used to split up complex behaviour into smaller parts,
			 * always starts with {@link startBehaviourName}.
			 */
			var BehaviourGraph = /** @class */ (function () {
			    function BehaviourGraph(start) {
			        this.behaviours = {};
			        this.validation = { valid: true, errors: [] };
			        this.startBehaviourName = start.name;
			        this.add(start);
			    }
			    /**
			     * Add behaviour node to graph
			     */
			    BehaviourGraph.prototype.add = function (behaviour) {
			        this.behaviours[behaviour.name] = behaviour;
			        this.validate();
			    };
			    /**
			     *
			     */
			    BehaviourGraph.prototype.traverse = function (entity, world) {
			        if (!this.validation.valid) {
			            throw new GraphValidationError(this.validation);
			        }
			        var walk = [];
			        var nextBehaviourName = this.startBehaviourName;
			        while (nextBehaviourName) {
			            var behaviour = this.behaviours[nextBehaviourName];
			            if (walk.includes(behaviour.name)) {
			                throw new Error('Cycle detected while traversing: ' + __spreadArray(__spreadArray([], walk, true), [behaviour.name], false).join(','));
			            }
			            walk.push(behaviour.name);
			            nextBehaviourName = behaviour.perform(entity, world);
			        }
			        return walk;
			    };
			    /**
			     * Check that all responses are linked to existing behaviours
			     */
			    BehaviourGraph.prototype.validate = function () {
			        this.validation = this.validateBehaviour(this.startBehaviourName, []);
			        return this.validation;
			    };
			    /**
			     * @return behaviour graph in {@link https://mermaid.live/edit)|mermaid} format
			     */
			    BehaviourGraph.prototype.toString = function () {
			        var result = 'graph TD\n';
			        result += "  ".concat(this.startBehaviourName, "((").concat(this.startBehaviourName, "))\n");
			        var links = Array.from(new Set(this.nodeToLinks(this.startBehaviourName)));
			        for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
			            var l = links_1[_i];
			            result += "  ".concat(l, "\n");
			        }
			        return result;
			    };
			    /**
			     * Convert linked behaviour into array of links in dot format
			     */
			    BehaviourGraph.prototype.nodeToLinks = function (name) {
			        if (!this.validation.valid) {
			            throw new GraphValidationError(this.validation);
			        }
			        var result = [];
			        var headNode = this.behaviours[name];
			        for (var _i = 0, _a = headNode.responses; _i < _a.length; _i++) {
			            var response = _a[_i];
			            var tailNode = this.behaviours[response];
			            result.push("".concat(name, " --> ").concat(tailNode.name));
			            result = result.concat(this.nodeToLinks(tailNode.name));
			        }
			        return result;
			    };
			    /**
			     * @return {ValidateReport}
			     */
			    BehaviourGraph.prototype.validateBehaviour = function (name, parents) {
			        var _this = this;
			        var report = { valid: true, errors: [] };
			        var behaviour = this.behaviours[name];
			        var walk = __spreadArray(__spreadArray([], parents, true), [name], false);
			        if (!behaviour) {
			            report.valid = false;
			            report.errors.push({ error: "Behaviour '".concat(name, "' does not exist"), walk: walk });
			        }
			        else if (behaviour.responses.length) {
			            behaviour.responses.forEach(function (r) {
			                var _a;
			                var responseReport = _this.validateBehaviour(r, walk);
			                if (!responseReport.valid) {
			                    report.valid = false;
			                    (_a = report.errors).push.apply(_a, responseReport.errors);
			                }
			            });
			        }
			        return report;
			    };
			    return BehaviourGraph;
			}());
			BehaviourGraph$1.default = BehaviourGraph;

			var Direction = {};

			var Vector$1 = {};

			var memoize$1 = {};

			Object.defineProperty(memoize$1, "__esModule", { value: true });
			memoize$1.memoize = void 0;
			/**
			 * @param fn - Function to memoize function
			 * @param toKey - Convert arguments to key to memoize by
			 */
			function memoize(fn, toKey) {
			    var cache = {};
			    return function () {
			        var args = [];
			        for (var _i = 0; _i < arguments.length; _i++) {
			            args[_i] = arguments[_i];
			        }
			        var key = toKey.apply(void 0, args);
			        if (key in cache) {
			            return cache[key];
			        }
			        else {
			            var result = fn.apply(void 0, args);
			            cache[key] = result;
			            return result;
			        }
			    };
			}
			memoize$1.memoize = memoize;

			Object.defineProperty(Vector$1, "__esModule", { value: true });
			Vector$1.v = void 0;
			var memoize_1 = memoize$1;
			Vector$1.v = (0, memoize_1.memoize)(function (x, y) {
			    return new Vector(x, y);
			}, function (x, y) {
			    return "".concat(x, ",").concat(y);
			});
			/**
			 * Vector in two dimensional space
			 */
			var Vector = /** @class */ (function () {
			    function Vector(x, y) {
			        this.x = x;
			        this.y = y;
			    }
			    Vector.prototype.plus = function (other) {
			        return new Vector(this.x + other.x, this.y + other.y);
			    };
			    Vector.prototype.isEqual = function (other) {
			        return this.x === (other === null || other === void 0 ? void 0 : other.x) && this.y === (other === null || other === void 0 ? void 0 : other.y);
			    };
			    return Vector;
			}());
			Vector$1.default = Vector;

			(function (exports) {
			var __extends = (commonjsGlobal$1 && commonjsGlobal$1.__extends) || (function () {
			    var extendStatics = function (d, b) {
			        extendStatics = Object.setPrototypeOf ||
			            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
			            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
			        return extendStatics(d, b);
			    };
			    return function (d, b) {
			        if (typeof b !== "function" && b !== null)
			            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			        extendStatics(d, b);
			        function __() { this.constructor = d; }
			        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
			    };
			})();
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.cardinalDirections = exports.CENTRE = exports.NW = exports.W = exports.SW = exports.S = exports.SE = exports.E = exports.NE = exports.N = void 0;
			var Vector_1 = Vector$1;
			/**
			 * Cardinal direction pointing to one of the neighbouring cells
			 */
			var Direction = /** @class */ (function (_super) {
			    __extends(Direction, _super);
			    function Direction(cardinal, x, y) {
			        var _this = this;
			        if (x > 1 || x < -1 || y > 1 || y < -1) {
			            throw new Error('x and y should be between -1 and +1');
			        }
			        _this = _super.call(this, x, y) || this;
			        _this.cardinal = cardinal;
			        return _this;
			    }
			    Direction.prototype.toString = function () {
			        return this.cardinal;
			    };
			    return Direction;
			}(Vector_1.default));
			exports.default = Direction;
			exports.N = new Direction('N', 0, -1);
			exports.NE = new Direction('NE', 1, -1);
			exports.E = new Direction('E', 1, 0);
			exports.SE = new Direction('SE', 1, 1);
			exports.S = new Direction('S', 0, 1);
			exports.SW = new Direction('SW', -1, 1);
			exports.W = new Direction('W', -1, 0);
			exports.NW = new Direction('NW', -1, -1);
			/**
			 * Directs to current location
			 */
			exports.CENTRE = new Direction('CENTRE', 0, 0);
			/**
			 * The nine cardinal and intercardinal directions representing all neighbouring cells
			 */
			exports.cardinalDirections = Object.freeze([exports.N, exports.NE, exports.E, exports.SE, exports.S, exports.SW, exports.W, exports.NW]);
			}(Direction));

			var EntityBuilder = {};

			Object.defineProperty(EntityBuilder, "__esModule", { value: true });
			EntityBuilder.EntityBuilderMap = void 0;
			/**
			 * Create an Entity by its symbol
			 */
			var EntityBuilderMap = /** @class */ (function () {
			    function EntityBuilderMap() {
			        this.builders = {};
			    }
			    EntityBuilderMap.prototype.add = function (symbol, handler) {
			        if (this.builders[symbol]) {
			            throw new Error("Symbol '".concat(symbol, "' already has an entity handler"));
			        }
			        this.builders[symbol] = handler;
			    };
			    EntityBuilderMap.prototype.get = function (symbol) {
			        var entityHandler = this.builders[symbol];
			        if (!this.includes(symbol)) {
			            throw new Error("No entity builder found for symbol '".concat(symbol, "'"));
			        }
			        return entityHandler;
			    };
			    EntityBuilderMap.prototype.includes = function (symbol) {
			        return !!this.builders[symbol];
			    };
			    return EntityBuilderMap;
			}());
			EntityBuilder.EntityBuilderMap = EntityBuilderMap;

			var EntityProps$1 = {};

			var __extends = (commonjsGlobal$1 && commonjsGlobal$1.__extends) || (function () {
			    var extendStatics = function (d, b) {
			        extendStatics = Object.setPrototypeOf ||
			            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
			            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
			        return extendStatics(d, b);
			    };
			    return function (d, b) {
			        if (typeof b !== "function" && b !== null)
			            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			        extendStatics(d, b);
			        function __() { this.constructor = d; }
			        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
			    };
			})();
			Object.defineProperty(EntityProps$1, "__esModule", { value: true });
			EntityProps$1.EntityPropsWithLocation = EntityProps$1.EntityProps = void 0;
			/**
			 * Properties of an {@link Entity}
			 */
			var EntityProps = /** @class */ (function () {
			    function EntityProps(location) {
			        this.location = location;
			    }
			    return EntityProps;
			}());
			EntityProps$1.EntityProps = EntityProps;
			var EntityPropsWithLocation = /** @class */ (function (_super) {
			    __extends(EntityPropsWithLocation, _super);
			    function EntityPropsWithLocation(location) {
			        var _this = _super.call(this) || this;
			        _this.location = location;
			        return _this;
			    }
			    return EntityPropsWithLocation;
			}(EntityProps));
			EntityProps$1.EntityPropsWithLocation = EntityPropsWithLocation;

			var Grid$1 = {};

			var Matrix = {};

			Object.defineProperty(Matrix, "__esModule", { value: true });
			Matrix.forEachCell = Matrix.asArrays = Matrix.getCellIndex = Matrix.contains = void 0;
			var Vector_1$2 = Vector$1;
			function contains(location, matrix) {
			    return location.x >= 0 && location.x < matrix.getWidth() &&
			        location.y >= 0 && location.y < matrix.getHeight();
			}
			Matrix.contains = contains;
			function getCellIndex(location, matrix) {
			    return location.x + (matrix.getWidth() * location.y);
			}
			Matrix.getCellIndex = getCellIndex;
			function asArrays(matrix) {
			    var result = new Array(matrix.getHeight());
			    for (var hi = 0; hi < matrix.getHeight(); hi++) {
			        result[hi] = new Array(matrix.getWidth()).fill(0);
			    }
			    for (var y = 0; y < matrix.getHeight(); y++) {
			        for (var x = 0; x < matrix.getWidth(); x++) {
			            result[y][x] = matrix.get((0, Vector_1$2.v)(x, y));
			        }
			    }
			    return result;
			}
			Matrix.asArrays = asArrays;
			function forEachCell(matrix, handle) {
			    for (var y = 0; y < matrix.getHeight(); y++) {
			        for (var x = 0; x < matrix.getWidth(); x++) {
			            var location = (0, Vector_1$2.v)(x, y);
			            handle(matrix.get(location), location);
			        }
			    }
			}
			Matrix.forEachCell = forEachCell;

			var Space$1 = {};

			Object.defineProperty(Space$1, "__esModule", { value: true });
			Space$1.SPACE = void 0;
			var Space = /** @class */ (function () {
			    function Space(symbol, props) {
			        this.handled = true;
			        this.props = props;
			        this.symbol = symbol;
			    }
			    Space.prototype.handle = function () { };
			    return Space;
			}());
			/**
			 * Convenience space entity using the space character as symbol
			 */
			Space$1.SPACE = new Space(' ', {});

			Object.defineProperty(Grid$1, "__esModule", { value: true });
			var Matrix_1$3 = Matrix;
			var Space_1$1 = Space$1;
			var Vector_1$1 = Vector$1;
			/**
			 * Two-dimensional map of square cells with entities
			 */
			var Grid = /** @class */ (function () {
			    /**
			     * @param {number} width - Width of grid
			     * @param {number} height - Height of grid
			     * @param {Entity} [defaultEntity] - Locationless {@link Entity} used to fill empty cells
			     */
			    function Grid(width, height, defaultEntity) {
			        var _this = this;
			        if (defaultEntity === void 0) { defaultEntity = Space_1$1.SPACE; }
			        this.cells = new Array(width * height);
			        this.width = width;
			        this.height = height;
			        this.defaultEntity = defaultEntity;
			        this.forEach(function (_, x, y) { return _this.put(new Vector_1$1.default(x, y), defaultEntity); });
			    }
			    /**
			     * Does grid contain location?
			     */
			    Grid.prototype.contains = function (location) {
			        return (0, Matrix_1$3.contains)(location, this);
			    };
			    /**
			     * Get cell by vector
			     */
			    Grid.prototype.get = function (vector) {
			        return this.cells[vector.x + vector.y * this.width];
			    };
			    /**
			     * Set entity at location
			     *  - assign entity to new location
			     *  - when non-default entity:
			     *    update props.location
			     *  - when location occupied by a non-default entity:
			     *    delete location of occupying entity
			     *  @return {Entity} - Possible previous entity at the specified location, or null if default entity
			     */
			    Grid.prototype.put = function (location, entity) {
			        if (!location) {
			            throw new Error('No location');
			        }
			        var newIndex = (0, Matrix_1$3.getCellIndex)(location, this);
			        var entityToOverwrite = this.cells[newIndex];
			        this.cells[newIndex] = entity;
			        // Set location:
			        if (this.isNonDefault(entity)) {
			            var oldLocation = entity.props.location;
			            entity.props.location = location;
			            if (oldLocation && !oldLocation.isEqual(location)) {
			                var oldIndex = (0, Matrix_1$3.getCellIndex)(oldLocation, this);
			                this.cells[oldIndex] = this.defaultEntity;
			            }
			        }
			        if (this.isNonDefault(entityToOverwrite)) {
			            // Remove from grid and return:
			            delete entityToOverwrite.props.location;
			            return entityToOverwrite;
			        }
			        return null;
			    };
			    /**
			     * Remove entity from the board
			     * - Deletes location from props
			     * - Replaces cell with default entity
			     */
			    Grid.prototype.remove = function (location) {
			        var index = (0, Matrix_1$3.getCellIndex)(location, this);
			        var entity = this.cells[index];
			        this.cells[index] = this.defaultEntity;
			        if (entity.props.location) {
			            delete entity.props.location;
			            return entity;
			        }
			        return null;
			    };
			    /**
			     * Loop through entities by their location
			     * from left to right, from top to bottom
			     */
			    Grid.prototype.forEachCell = function (handler) {
			        this.forEach(function (entity, x, y) {
			            if (entity != null) {
			                var location = new Vector_1$1.default(x, y);
			                handler(entity, location);
			            }
			        });
			    };
			    /**
			     * Get all entities
			     */
			    Grid.prototype.getAll = function () {
			        return this.cells;
			    };
			    Grid.prototype.getHeight = function () {
			        return this.height;
			    };
			    Grid.prototype.getWidth = function () {
			        return this.width;
			    };
			    /**
			     * @return string[] map in which each character
			     * represents the symbol of an entity on the grid
			     */
			    Grid.prototype.toMap = function () {
			        var result = [];
			        this.forEach(function (entity, x, y) {
			            if (!result[y]) {
			                result[y] = '';
			            }
			            result[y] += entity.symbol;
			        });
			        return result;
			    };
			    /**
			     * @return string newline seperated map in which each character
			     * represents the symbol of an entity on the grid
			     */
			    Grid.prototype.toString = function () {
			        return this.toMap().join('\n');
			    };
			    /**
			     * Mark all entities as unhandled
			     */
			    Grid.prototype.unhandle = function () {
			        this.forEach(function (entity) {
			            entity.handled = false;
			        });
			    };
			    /**
			     * Loop through cells, from left to right, from top to bottom
			     */
			    Grid.prototype.forEach = function (handler) {
			        for (var y = 0; y < this.height; y++) {
			            for (var x = 0; x < this.width; x++) {
			                var entity = this.get(new Vector_1$1.default(x, y));
			                handler(entity, x, y);
			            }
			        }
			    };
			    /**
			     * Default has no location:
			     */
			    Grid.prototype.isNonDefault = function (entity) {
			        return !!(entity === null || entity === void 0 ? void 0 : entity.symbol) && entity.symbol !== this.defaultEntity.symbol;
			    };
			    return Grid;
			}());
			Grid$1.default = Grid;

			var Neighbours$1 = {};

			var randomIndex$1 = {};

			Object.defineProperty(randomIndex$1, "__esModule", { value: true });
			function randomIndex(arr) {
			    return Math.floor(Math.random() * arr.length);
			}
			randomIndex$1.default = randomIndex;

			Object.defineProperty(Neighbours$1, "__esModule", { value: true });
			var Direction_1$1 = Direction;
			var randomIndex_1$1 = randomIndex$1;
			/**
			 * A limited perspective of 1 cell in all directions
			 */
			var Neighbours = /** @class */ (function () {
			    function Neighbours(grid, centre) {
			        if (!centre) {
			            throw new Error('Location not set');
			        }
			        this.matrix = grid;
			        this.centre = centre;
			    }
			    Neighbours.prototype.getCentre = function () {
			        return this.centre;
			    };
			    Neighbours.prototype.get = function (dir) {
			        var target = this.centre.plus(dir);
			        if (this.matrix.contains(target)) {
			            return this.matrix.get(target);
			        }
			        return null;
			    };
			    Neighbours.prototype.put = function (dir, entity) {
			        var target = this.centre.plus(dir);
			        return this.matrix.put(target, entity);
			    };
			    Neighbours.prototype.findDir = function (predicate) {
			        for (var _i = 0, cardinalDirections_1 = Direction_1$1.cardinalDirections; _i < cardinalDirections_1.length; _i++) {
			            var dir = cardinalDirections_1[_i];
			            var entity = this.get(dir);
			            if (entity && predicate(entity)) {
			                return dir;
			            }
			        }
			        return null;
			    };
			    Neighbours.prototype.findDirs = function (predicate) {
			        var found = [];
			        for (var _i = 0, cardinalDirections_2 = Direction_1$1.cardinalDirections; _i < cardinalDirections_2.length; _i++) {
			            var dir = cardinalDirections_2[_i];
			            var entity = this.get(dir);
			            if (entity && predicate(entity)) {
			                found.push(dir);
			            }
			        }
			        return found;
			    };
			    Neighbours.prototype.findDirRand = function (predicate) {
			        var offset = (0, randomIndex_1$1.default)(Direction_1$1.cardinalDirections);
			        for (var i = 0; i < Direction_1$1.cardinalDirections.length; i++) {
			            var pointer = (i + offset) % Direction_1$1.cardinalDirections.length;
			            var dir = Direction_1$1.cardinalDirections[pointer];
			            var entity = this.get(dir);
			            if (entity && predicate(entity)) {
			                return dir;
			            }
			        }
			        return null;
			    };
			    Neighbours.prototype.remove = function (dir) {
			        var target = this.centre.plus(dir);
			        return this.matrix.remove(target);
			    };
			    return Neighbours;
			}());
			Neighbours$1.default = Neighbours;

			var PerlinMapBuilder$1 = {};

			var WorldMatrix$1 = {};

			Object.defineProperty(WorldMatrix$1, "__esModule", { value: true });
			WorldMatrix$1.WorldMatrix = void 0;
			var Matrix_1$2 = Matrix;
			/**
			 * Matrix with symbols
			 */
			var WorldMatrix = /** @class */ (function () {
			    function WorldMatrix(width, height, defaultSymbol) {
			        this.width = width;
			        this.height = height;
			        this.defaultSymbol = defaultSymbol;
			        this.cells = this.createMatrix();
			    }
			    WorldMatrix.prototype.get = function (vector) {
			        return this.cells[(0, Matrix_1$2.getCellIndex)(vector, this)];
			    };
			    WorldMatrix.prototype.getAll = function () {
			        return this.cells;
			    };
			    WorldMatrix.prototype.getHeight = function () {
			        return this.height;
			    };
			    WorldMatrix.prototype.getWidth = function () {
			        return this.width;
			    };
			    WorldMatrix.prototype.put = function (location, cell) {
			        var old = this.get(location);
			        this.cells[(0, Matrix_1$2.getCellIndex)(location, this)] = cell;
			        return old;
			    };
			    WorldMatrix.prototype.remove = function (location) {
			        throw new Error('Not implemented');
			    };
			    WorldMatrix.prototype.contains = function (location) {
			        return (0, Matrix_1$2.contains)(location, this);
			    };
			    WorldMatrix.prototype.forEachCell = function (handler) {
			        (0, Matrix_1$2.forEachCell)(this, handler);
			    };
			    WorldMatrix.prototype.createMatrix = function () {
			        return new Array(this.height * this.width).fill(this.defaultSymbol);
			    };
			    return WorldMatrix;
			}());
			WorldMatrix$1.WorldMatrix = WorldMatrix;

			var PerlinMatrix$1 = {};

			var Perlin = {};

			Object.defineProperty(Perlin, "__esModule", { value: true });
			/**
			 * JAVA REFERENCE IMPLEMENTATION OF IMPROVED NOISE - COPYRIGHT 2002 KEN PERLIN.
			 * Ported to TypeScript
			 * Source: https://mrl.cs.nyu.edu/~perlin/noise/
			 */
			var ImprovedNoise = /** @class */ (function () {
			    function ImprovedNoise() {
			    }
			    ImprovedNoise.noise = function (x, y, z) {
			        var X = Math.floor(x) & 255; // FIND UNIT CUBE THAT
			        var Y = Math.floor(y) & 255; // CONTAINS POINT.
			        var Z = Math.floor(z) & 255;
			        x -= Math.floor(x); // FIND RELATIVE X,Y,Z
			        y -= Math.floor(y); // OF POINT IN CUBE.
			        z -= Math.floor(z);
			        var u = this.fade(x); // COMPUTE FADE CURVES
			        var v = this.fade(y); // FOR EACH OF X,Y,Z.
			        var w = this.fade(z);
			        var A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z, // HASH COORDINATES OF
			        B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z; // THE 8 CUBE CORNERS,
			        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), // AND ADD
			        this.grad(this.p[BA], x - 1, y, z)), // BLENDED
			        this.lerp(u, this.grad(this.p[AB], x, y - 1, z), // RESULTS
			        this.grad(this.p[BB], x - 1, y - 1, z))), // FROM  8
			        this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), // CORNERS
			        this.grad(this.p[BA + 1], x - 1, y, z - 1)), // OF CUBE
			        this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
			    };
			    ImprovedNoise.fade = function (t) {
			        return t * t * t * (t * (t * 6 - 15) + 10);
			    };
			    ImprovedNoise.lerp = function (t, a, b) {
			        return a + t * (b - a);
			    };
			    ImprovedNoise.grad = function (hash, x, y, z) {
			        var h = hash & 15; // CONVERT LO 4 BITS OF HASH CODE
			        var u = h < 8 ? x : y; // INTO 12 GRADIENT DIRECTIONS.
			        var v = h < 4 ? y : h == 12 || h == 14 ? x : z;
			        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
			    };
			    var _a;
			    _a = ImprovedNoise;
			    ImprovedNoise.permutation = [151, 160, 137, 91, 90, 15,
			        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
			        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
			        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
			        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
			        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
			        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
			        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
			        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
			        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
			        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
			        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
			        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
			    ];
			    ImprovedNoise.p = new Array(512);
			    (function () {
			        for (var i = 0; i < 256; i++) {
			            _a.p[256 + i] = _a.p[i] = _a.permutation[i];
			        }
			    })();
			    return ImprovedNoise;
			}());
			Perlin.default = ImprovedNoise;

			Object.defineProperty(PerlinMatrix$1, "__esModule", { value: true });
			PerlinMatrix$1.mapMatrix = void 0;
			var Matrix_1$1 = Matrix;
			var Perlin_1 = Perlin;
			var Vector_1 = Vector$1;
			/**
			 * Build a map using [Perlin Noise]{@link https://en.wikipedia.org/wiki/Perlin_noise}
			 */
			var PerlinMatrix = /** @class */ (function () {
			    function PerlinMatrix(width, height, config) {
			        this.width = width;
			        this.height = height;
			        this.config = Object.assign({}, PerlinMatrix.defaultConfig, config);
			        this.seed = this.config.useSeed
			            ? Math.PI
			            : 0;
			        this.cells = this.createMatrix();
			    }
			    PerlinMatrix.from = function (old) {
			        return new PerlinMatrix(old.width, old.height, old.config);
			    };
			    /**
			     * Convert perlin range of ~[-0.7, +0.7] to fractions [0, 1]
			     */
			    PerlinMatrix.prototype.asFractions = function () {
			        var perlinRange = PerlinMatrix.range[1];
			        return mapMatrix(this, function (_, value) { return (value + perlinRange) / (perlinRange * 2); });
			    };
			    PerlinMatrix.prototype.forEachCell = function (handler) {
			        (0, Matrix_1$1.forEachCell)(this, handler);
			    };
			    PerlinMatrix.prototype.get = function (vector) {
			        return this.cells[(0, Matrix_1$1.getCellIndex)(vector, this)];
			    };
			    PerlinMatrix.prototype.getAll = function () {
			        return this.cells;
			    };
			    PerlinMatrix.prototype.getHeight = function () {
			        return this.height;
			    };
			    PerlinMatrix.prototype.getWidth = function () {
			        return this.width;
			    };
			    PerlinMatrix.prototype.put = function (location, cell) {
			        var old = this.get(location);
			        this.cells[(0, Matrix_1$1.getCellIndex)(location, this)] = cell;
			        return old;
			    };
			    PerlinMatrix.prototype.remove = function (location) {
			        throw new Error('Not implemented');
			    };
			    PerlinMatrix.prototype.contains = function (location) {
			        return (0, Matrix_1$1.contains)(location, this);
			    };
			    PerlinMatrix.prototype.createMatrix = function () {
			        var matrix = [];
			        for (var hi = 0; hi < this.height; hi++) {
			            for (var wi = 0; wi < this.width; wi++) {
			                var x = wi + this.seed;
			                var y = hi + this.seed;
			                var scaledY = y * this.config.scale;
			                var scaledX = x * this.config.scale;
			                var shiftedX = scaledX + this.config.shift;
			                var shiftedY = scaledY + this.config.shift;
			                if (Number.isInteger(shiftedY) && Number.isInteger(shiftedY)) {
			                    throw new Error("Use floats instead of integers: x=".concat(shiftedX, "; y=").concat(shiftedY));
			                }
			                matrix.push(Perlin_1.default.noise(shiftedX, shiftedY, 0));
			            }
			        }
			        return matrix;
			    };
			    PerlinMatrix.range = [-Math.sqrt(2) / 2, Math.sqrt(2) / 2];
			    PerlinMatrix.defaultConfig = {
			        scale: 1,
			        shift: 0,
			        useSeed: true
			    };
			    return PerlinMatrix;
			}());
			PerlinMatrix$1.default = PerlinMatrix;
			function mapMatrix(matrix, handle) {
			    var result = PerlinMatrix.from(matrix);
			    for (var y = 0; y < matrix.getHeight(); y++) {
			        for (var x = 0; x < matrix.getWidth(); x++) {
			            var location = (0, Vector_1.v)(x, y);
			            result.put(location, handle(location, matrix.get(location)));
			        }
			    }
			    return result;
			}
			PerlinMatrix$1.mapMatrix = mapMatrix;

			Object.defineProperty(PerlinMapBuilder$1, "__esModule", { value: true });
			var Matrix_1 = Matrix;
			var WorldMatrix_1 = WorldMatrix$1;
			var PerlinMatrix_1 = PerlinMatrix$1;
			var PerlinMapBuilder = /** @class */ (function () {
			    function PerlinMapBuilder(width, height, config) {
			        this._symbols = new Array();
			        this.width = width;
			        this.height = height;
			        this.config = Object.assign({}, PerlinMapBuilder.defaultConfig, config);
			        this._symbols = this.config.entities;
			    }
			    PerlinMapBuilder.prototype.build = function () {
			        var _this = this;
			        var matrixConfig = {
			            scale: this.config.scale,
			            shift: this.config.shifter(),
			            useSeed: this.config.useSeed
			        };
			        var matrix = new PerlinMatrix_1.default(this.width, this.height, matrixConfig).asFractions();
			        var map = new WorldMatrix_1.WorldMatrix(this.width, this.height, this.config.defaultSymbol);
			        this._symbols.forEach(function (symbol) {
			            matrix.forEachCell(function (value, location) {
			                if (map.get(location) !== _this.config.defaultSymbol) {
			                    return;
			                }
			                if (!symbol.match(location, matrix)) {
			                    return;
			                }
			                map.put(location, symbol.symbol);
			            });
			        });
			        return (0, Matrix_1.asArrays)(map).map(function (row) { return row.map(function (cell) { return cell; }).join(''); });
			    };
			    Object.defineProperty(PerlinMapBuilder.prototype, "symbols", {
			        get: function () {
			            return this._symbols;
			        },
			        set: function (value) {
			            this._symbols = value;
			        },
			        enumerable: false,
			        configurable: true
			    });
			    PerlinMapBuilder.defaultConfig = {
			        /**
			         * List of symbols, added in the order they appear in the array
			         */
			        entities: [],
			        scale: 0.25,
			        defaultSymbol: ' ',
			        shifter: function () { return 0; },
			        useSeed: true
			    };
			    return PerlinMapBuilder;
			}());
			PerlinMapBuilder$1.default = PerlinMapBuilder;

			var isInRange$1 = {};

			Object.defineProperty(isInRange$1, "__esModule", { value: true });
			isInRange$1.isInRange = void 0;
			function isInRange(value, range) {
			    return value > range[0] && value < range[1];
			}
			isInRange$1.isInRange = isInRange;

			var randomDirection$1 = {};

			var randomElement$1 = {};

			Object.defineProperty(randomElement$1, "__esModule", { value: true });
			var randomIndex_1 = randomIndex$1;
			function randomElement(arr) {
			    return arr[(0, randomIndex_1.default)(arr)];
			}
			randomElement$1.default = randomElement;

			Object.defineProperty(randomDirection$1, "__esModule", { value: true });
			var Direction_1 = Direction;
			var randomElement_1 = randomElement$1;
			/**
			 * @return one of the {@link cardinalDirections}
			 */
			function randomDirection() {
			    return (0, randomElement_1.default)(Direction_1.cardinalDirections);
			}
			randomDirection$1.default = randomDirection;

			var World$1 = {};

			Object.defineProperty(World$1, "__esModule", { value: true });
			var EntityProps_1 = EntityProps$1;
			var Grid_1 = Grid$1;
			var Space_1 = Space$1;
			/**
			 * Inspired by: https://eloquentjavascript.net/2nd_edition/07_elife.html
			 */
			var World = /** @class */ (function () {
			    /**
			     * World containing a grid populated with entities
			     */
			    function World(config) {
			        this.defaultEntity = Space_1.SPACE;
			        /**
			         * Turns that have passed since start of world
			         */
			        this._age = 0;
			        this.initDefaultEntity(config);
			        this.grid = this.mapToGrid(config);
			    }
			    World.prototype.mapToGrid = function (config) {
			        var grid = new Grid_1.default(config.map[0].length, config.map.length, this.defaultEntity);
			        grid.forEachCell(function (_, location) {
			            var foundProps = config.entityProps.find(function (p) {
			                return p && p.location && p.location.x === location.x && p.location.y === location.y;
			            });
			            var props = foundProps || new EntityProps_1.EntityProps(location);
			            var mapSymbol = config.map[location.y][location.x];
			            var entity = config.builders.get(mapSymbol).build(props);
			            grid.put(location, entity);
			        });
			        return grid;
			    };
			    /**
			     * Make the world turn one round
			     */
			    World.prototype.turn = function () {
			        var _this = this;
			        this.grid.unhandle();
			        this.grid.forEachCell(function (entity, location) {
			            if (entity.handled) {
			                return;
			            }
			            entity.handle(location, _this);
			            entity.handled = true;
			        });
			        this._age++;
			        return this.grid;
			    };
			    World.prototype.getGrid = function () {
			        return this.grid;
			    };
			    Object.defineProperty(World.prototype, "age", {
			        /**
			         * Turns that have passed since beginning of world
			         */
			        get: function () {
			            return this._age;
			        },
			        enumerable: false,
			        configurable: true
			    });
			    World.prototype.initDefaultEntity = function (config) {
			        var _this = this;
			        if (config.defaultEntity) {
			            this.defaultEntity = config.defaultEntity;
			        }
			        if (!config.builders.includes(this.defaultEntity.symbol)) {
			            config.builders.add(this.defaultEntity.symbol, { build: function () { return _this.defaultEntity; } });
			        }
			    };
			    return World;
			}());
			World$1.default = World;

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.WorldMatrix = exports.World = exports.Vector = exports.Neighbours = exports.randomElement = exports.randomDirection = exports.PerlinMapBuilder = exports.PerlinMatrix = exports.isInRange = exports.Grid = exports.EntityProps = exports.EntityBuilderMap = exports.CENTRE = exports.NW = exports.W = exports.SW = exports.S = exports.SE = exports.E = exports.NE = exports.N = exports.cardinalDirections = exports.Direction = exports.BehaviourGraph = exports.Behaviour = void 0;
			/**
			 * Export barrel
			 */
			var BehaviourGraph_1 = BehaviourGraph$1;
			exports.BehaviourGraph = BehaviourGraph_1.default;
			Object.defineProperty(exports, "Behaviour", { enumerable: true, get: function () { return BehaviourGraph_1.Behaviour; } });
			var Direction_1 = Direction;
			exports.Direction = Direction_1.default;
			Object.defineProperty(exports, "cardinalDirections", { enumerable: true, get: function () { return Direction_1.cardinalDirections; } });
			Object.defineProperty(exports, "CENTRE", { enumerable: true, get: function () { return Direction_1.CENTRE; } });
			Object.defineProperty(exports, "E", { enumerable: true, get: function () { return Direction_1.E; } });
			Object.defineProperty(exports, "N", { enumerable: true, get: function () { return Direction_1.N; } });
			Object.defineProperty(exports, "NE", { enumerable: true, get: function () { return Direction_1.NE; } });
			Object.defineProperty(exports, "NW", { enumerable: true, get: function () { return Direction_1.NW; } });
			Object.defineProperty(exports, "S", { enumerable: true, get: function () { return Direction_1.S; } });
			Object.defineProperty(exports, "SE", { enumerable: true, get: function () { return Direction_1.SE; } });
			Object.defineProperty(exports, "SW", { enumerable: true, get: function () { return Direction_1.SW; } });
			Object.defineProperty(exports, "W", { enumerable: true, get: function () { return Direction_1.W; } });
			var EntityBuilder_1 = EntityBuilder;
			Object.defineProperty(exports, "EntityBuilderMap", { enumerable: true, get: function () { return EntityBuilder_1.EntityBuilderMap; } });
			var EntityProps_1 = EntityProps$1;
			Object.defineProperty(exports, "EntityProps", { enumerable: true, get: function () { return EntityProps_1.EntityProps; } });
			var Grid_1 = Grid$1;
			exports.Grid = Grid_1.default;
			var Neighbours_1 = Neighbours$1;
			exports.Neighbours = Neighbours_1.default;
			var PerlinMapBuilder_1 = PerlinMapBuilder$1;
			exports.PerlinMapBuilder = PerlinMapBuilder_1.default;
			var PerlinMatrix_1 = PerlinMatrix$1;
			exports.PerlinMatrix = PerlinMatrix_1.default;
			var isInRange_1 = isInRange$1;
			Object.defineProperty(exports, "isInRange", { enumerable: true, get: function () { return isInRange_1.isInRange; } });
			var randomDirection_1 = randomDirection$1;
			exports.randomDirection = randomDirection_1.default;
			var randomElement_1 = randomElement$1;
			exports.randomElement = randomElement_1.default;
			var Vector_1 = Vector$1;
			exports.Vector = Vector_1.default;
			var World_1 = World$1;
			exports.World = World_1.default;
			var WorldMatrix_1 = WorldMatrix$1;
			Object.defineProperty(exports, "WorldMatrix", { enumerable: true, get: function () { return WorldMatrix_1.WorldMatrix; } });
			}(dist));

			var index = /*@__PURE__*/getDefaultExportFromCjs(dist);

			return index;

		})); 
	} (pixcellular));

	var pixcellularExports = pixcellular.exports;

	var START = 'START';
	var STOP = 'STOP';
	var GROW = 'GROW';
	var CLONE = 'CLONE';
	var REPRODUCE = 'REPRODUCE';
	var EAT = 'EAT';
	var MOVE = 'MOVE';

	function isPlantProps(props) {
	    if (props && props.energy) {
	        return props;
	    }
	}

	var Store = /** @class */ (function () {
	    function Store() {
	    }
	    return Store;
	}());
	var store = new Store();
	store.loopDurationMs = 100;
	store.herbivoreInitialEnergy = 1000;
	store.herbivoreReproductionThreshold = 3500;
	store.herbivoreMetabolismCosts = 20;
	store.plantGrowEnergy = 2;
	store.plantGrowLimit = 150;
	store.plantCloneThreshold = 50;

	var SPACE = ' ';
	var STONE = '#';
	var PLANT = 'O';
	var HERBIVORE = '^';

	var starting$1 = new pixcellularExports.Behaviour(START, function (entity, world) {
	    var view = new pixcellularExports.Neighbours(world.getGrid(), entity.props.location);
	    if (canReproduce(entity)) {
	        return REPRODUCE;
	    }
	    var plantDir = view.findDir(function (e) { return e.symbol === PLANT; });
	    if (plantDir) {
	        return EAT;
	    }
	    var spaceDir = view.findDir(function (e) { return e.symbol === SPACE; });
	    if (spaceDir) {
	        return MOVE;
	    }
	    return;
	}, [REPRODUCE, EAT, MOVE]);
	var reproducing = new pixcellularExports.Behaviour(REPRODUCE, function (entity, world) {
	    var view = new pixcellularExports.Neighbours(world.getGrid(), entity.props.location);
	    var space = view.findDirRand(function (e) { return e.symbol === SPACE; });
	    if (space) {
	        var childProps = { energy: Math.floor(entity.props.energy / 3) };
	        var child = entity.builder.build(childProps);
	        view.put(space, child);
	        entity.props.energy -= child.props.energy * 2;
	    }
	    return STOP;
	}, [STOP]);
	var eating = new pixcellularExports.Behaviour(EAT, function (entity, world) {
	    var view = new pixcellularExports.Neighbours(world.getGrid(), entity.props.location);
	    var plantDir = view.findDirRand(function (e) { return e.symbol === PLANT; });
	    var plant = view.get(plantDir);
	    if (isPlantProps(plant.props)) {
	        entity.props.energy += plant.props.energy;
	        view.remove(plantDir);
	        return canReproduce(entity)
	            ? REPRODUCE
	            : STOP;
	    }
	    else {
	        return MOVE;
	    }
	}, [REPRODUCE, MOVE, STOP]);
	var moving = new pixcellularExports.Behaviour(MOVE, function (entity, world) {
	    var _a;
	    var view = new pixcellularExports.Neighbours(world.getGrid(), entity.props.location);
	    var dir;
	    if (((_a = view.get(entity.props.dir)) === null || _a === void 0 ? void 0 : _a.symbol) === SPACE) {
	        // Move in props direction:
	        dir = entity.props.dir;
	    }
	    else {
	        // Find random space:
	        dir = view.findDirRand(function (e) { return e.symbol === SPACE; });
	    }
	    if (dir) {
	        view.put(dir, entity);
	        entity.props.dir = dir;
	    }
	    return STOP;
	}, [STOP]);
	var stopping = new pixcellularExports.Behaviour(STOP, function (entity, world) {
	    entity.props.energy -= store.herbivoreMetabolismCosts;
	    if (entity.props.energy <= 0) {
	        var view = new pixcellularExports.Neighbours(world.getGrid(), entity.props.location);
	        view.remove(pixcellularExports.CENTRE);
	    }
	    return null;
	}, []);
	function canReproduce(entity) {
	    return entity.props.energy > store.herbivoreReproductionThreshold;
	}
	var herbivoreBehaviour = new pixcellularExports.BehaviourGraph(starting$1);
	herbivoreBehaviour.add(reproducing);
	herbivoreBehaviour.add(eating);
	herbivoreBehaviour.add(moving);
	herbivoreBehaviour.add(stopping);
	console.log('Herbivore behaviour graph in mermaid format:\n', herbivoreBehaviour.toString());

	var Herbivore = /** @class */ (function () {
	    function Herbivore(props, graph, builder) {
	        this.symbol = HERBIVORE;
	        this.props = props;
	        this.graph = graph;
	        this.builder = builder;
	    }
	    Herbivore.prototype.handle = function (location, world) {
	        this.graph.traverse(this, world);
	    };
	    return Herbivore;
	}());

	var HerbivoreBuilder = /** @class */ (function () {
	    function HerbivoreBuilder(defaultEnergy, graph) {
	        this.defaultEnergy = defaultEnergy;
	        this.graph = graph;
	    }
	    HerbivoreBuilder.prototype.build = function (props) {
	        var newProps = this.createProps(props);
	        return new Herbivore(newProps, this.graph, this);
	    };
	    HerbivoreBuilder.prototype.createProps = function (props) {
	        var newProps = {
	            energy: props.energy || this.defaultEnergy,
	            dir: pixcellularExports.randomDirection(),
	        };
	        return Object.assign(newProps, props);
	    };
	    return HerbivoreBuilder;
	}());

	/**
	 * Use a perlin noise generator
	 * to determine how to populate our grid with entities
	 */
	var HerbivoreMapBuilder = /** @class */ (function () {
	    function HerbivoreMapBuilder(width, height) {
	        var wall = {
	            symbol: STONE,
	            match: function (location, matrix) { return pixcellularExports.isInRange(matrix.get(location), [0.6, 1]); },
	        };
	        var plant = {
	            symbol: PLANT,
	            match: function (location, matrix) {
	                var inRange = pixcellularExports.isInRange(matrix.get(location), [0.3, 1]);
	                if (!inRange) {
	                    return false;
	                }
	                toggle = !toggle;
	                return toggle;
	            },
	        };
	        var toggle = false;
	        var herbivore = {
	            symbol: HERBIVORE,
	            match: function (location, matrix) { return pixcellularExports.isInRange(matrix.get(location), [0, 0.1]); },
	        };
	        var config = {
	            defaultSymbol: ' ',
	            entities: [
	                wall,
	                plant,
	                herbivore
	            ],
	            scale: 0.25,
	            shifter: function () { return Math.random() * 1000; }
	        };
	        this.perlinBuilder = new pixcellularExports.PerlinMapBuilder(width, height, config);
	    }
	    Object.defineProperty(HerbivoreMapBuilder.prototype, "symbols", {
	        get: function () {
	            return this.perlinBuilder.symbols;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    HerbivoreMapBuilder.prototype.build = function () {
	        return this.perlinBuilder.build();
	    };
	    return HerbivoreMapBuilder;
	}());

	var starting = new pixcellularExports.Behaviour(START, function (entity) {
	    if (entity.props.energy > store.plantCloneThreshold) {
	        return CLONE;
	    }
	    else {
	        return GROW;
	    }
	}, [CLONE, GROW]);
	var growing = new pixcellularExports.Behaviour(GROW, function (entity) {
	    if (entity.props.energy < store.plantGrowLimit) {
	        entity.props.energy += store.plantGrowEnergy;
	    }
	    return null;
	}, []);
	var cloning = new pixcellularExports.Behaviour(CLONE, function (entity, world) {
	    var view = new pixcellularExports.Neighbours(world.getGrid(), entity.props.location);
	    var space = view.findDirRand(function (e) { return e.symbol === SPACE; });
	    if (space) {
	        var childEnergy = Math.ceil(Math.random() * entity.props.energy);
	        entity.props.energy -= childEnergy;
	        view.put(space, entity.builder.build({ energy: childEnergy }));
	        return null;
	    }
	    else {
	        return GROW;
	    }
	}, [GROW]);
	/**
	 * To structure more complex entity behaviour, we can use a {@link BehaviourGraph}
	 * to split it up in different subbehaviours.
	 * Every behaviour returns an action, which tells the graph which behaviour to call next.
	 *
	 * The resulting action of a behaviour depends on the properties of an entity.
	 * See for example the {@link starting} behaviour of plants:
	 * - when a plant has much energy, it will try to clone itself;
	 * - and otherwise it will simply grow and increase its energy.
	 *
	 * The graph always starts with the starting behaviour and ends with the stopping behaviour.
	 */
	var plantBehaviour = new pixcellularExports.BehaviourGraph(starting);
	plantBehaviour.add(growing);
	plantBehaviour.add(cloning);
	console.log('Plant behaviour graph in mermaid format:\n', plantBehaviour.toString());

	var Plant = /** @class */ (function () {
	    function Plant(props, graph, builder) {
	        this.symbol = PLANT;
	        this.props = props;
	        this.graph = graph;
	        this.builder = builder;
	    }
	    Plant.prototype.handle = function (location, world) {
	        this.graph.traverse(this, world);
	    };
	    return Plant;
	}());

	var PlantBuilder = /** @class */ (function () {
	    function PlantBuilder(defaultProps, graph) {
	        this.defaultProps = defaultProps;
	        this.graph = graph;
	    }
	    PlantBuilder.prototype.build = function (props) {
	        var newProps = props;
	        if (!isPlantProps(props)) {
	            newProps = Object.assign({}, this.defaultProps, props);
	            newProps.energy = Math.random() * this.defaultProps.energy;
	        }
	        return new Plant(newProps, this.graph, this);
	    };
	    return PlantBuilder;
	}());

	var SpaceBuilder = /** @class */ (function () {
	    function SpaceBuilder() {
	    }
	    SpaceBuilder.prototype.build = function () {
	        return { symbol: SPACE, props: {}, handle: function () { return null; } };
	    };
	    return SpaceBuilder;
	}());

	var SETTINGS_ID = 'settings';
	var StoreForm = /** @class */ (function () {
	    function StoreForm() {
	        var _this = this;
	        this.$form = document.getElementById(SETTINGS_ID);
	        this.$inputs = {};
	        Object.keys(store).forEach(function (k) {
	            _this.createFormFieldDom(k);
	        });
	    }
	    StoreForm.prototype.updateStore = function () {
	        var _this = this;
	        Object.keys(store).forEach(function (k) {
	            store[k] = parseInt(_this.$inputs[k].value, 10);
	        });
	        console.log('Updated store', store);
	    };
	    StoreForm.prototype.createFormFieldDom = function (k) {
	        var $input = document.createElement('input');
	        $input.setAttribute('type', 'text');
	        $input.setAttribute('value', store[k]);
	        var $label = document.createElement('label');
	        $label.innerHTML = k + ':';
	        $label.append(document.createElement('br'));
	        $label.append($input);
	        var $div = document.createElement('div');
	        $div.classList.add('store-form-field');
	        $div.append($label);
	        this.$form.append($div);
	        this.$inputs[k] = $input;
	    };
	    return StoreForm;
	}());

	var CREATE_BTN_ID = 'create-world';
	var App = /** @class */ (function () {
	    function App() {
	        this.$grid = document.getElementById('grid');
	        this.$createBtn = document.getElementById(CREATE_BTN_ID);
	        this.mapBuilder = new HerbivoreMapBuilder(200, 100);
	    }
	    App.prototype.run = function () {
	        this.displayOnCreateClick(new StoreForm());
	        var map = this.mapBuilder.build();
	        this.displayWorld(createWorld(map));
	    };
	    App.prototype.displayOnCreateClick = function (storeForm) {
	        var _this = this;
	        this.$createBtn.addEventListener('click', function (e) {
	            e.preventDefault();
	            storeForm.updateStore();
	            var map = _this.mapBuilder.build();
	            _this.displayWorld(createWorld(map));
	        });
	    };
	    App.prototype.displayWorld = function (world) {
	        var _this = this;
	        if (this.currentInterval) {
	            clearInterval(this.currentInterval);
	        }
	        this.currentInterval = setInterval(function () {
	            var start = performance.now();
	            world.turn();
	            console.log('turn took', (performance.now() - start).toFixed(0));
	            _this.displayWorldOnce(world);
	        }, store.loopDurationMs);
	    };
	    App.prototype.displayWorldOnce = function (world) {
	        var currentPlants = [];
	        var currentHerbivores = [];
	        world.getGrid().forEachCell(function (e) {
	            if (e.symbol === PLANT) {
	                currentPlants.push(e.props);
	            }
	            if (e.symbol === HERBIVORE) {
	                currentHerbivores.push(e.props);
	            }
	        });
	        console.log('turn', world.age, {
	            grid: world.getGrid(),
	            herbivores: currentHerbivores,
	            plants: currentPlants
	        });
	        this.$grid.innerText = world.getGrid().toString();
	    };
	    return App;
	}());
	function createWorld(map) {
	    // Factory that will convert the map into entities:
	    var builders = new pixcellularExports.EntityBuilderMap();
	    builders.add(SPACE, new SpaceBuilder());
	    builders.add(STONE, { build: function () { return ({ symbol: STONE, props: {}, handle: function () { return null; } }); } });
	    builders.add(PLANT, new PlantBuilder({ energy: 20 }, plantBehaviour));
	    builders.add(HERBIVORE, new HerbivoreBuilder(store.herbivoreInitialEnergy, herbivoreBehaviour));
	    return new pixcellularExports.World({ map: map, entityProps: [], builders: builders });
	}

	new App().run();

})();
//# sourceMappingURL=bundle.js.map
