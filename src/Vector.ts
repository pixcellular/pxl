/**
 * Vector in two dimensional space
 */
export default class Vector {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    public plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
}
