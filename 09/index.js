const vs = { L: [-1, 0], R: [1, 0], U: [0, -1], D: [0, 1] }

class Knot extends require('node:events').EventEmitter {
    get position() { return this._position }
    get uniquePositions() { return new Set(this.history.map(([x,y]) => `${x}|${y}`)).size }
    
    set position(p) {
        this._position = p
        this.history.push(p)
        this.emit('moved')
    }

    constructor() {
        super()
        this.history = []
        this.position = [0,0]
    }

    move([byX, byY]) {
        const [x,y] = this.position
        this.position = [x + byX, y + byY]
    }

    follow(other) {
        other.on('moved', () => {
            const [mx, my] = this.position
            const [ox, oy] = other.position
            const d = Math.max( // Chebyshev
                Math.abs(ox - mx),
                Math.abs(oy - my)
            ) 
            if (d > 1) {
                const [dx, dy] = [ox - mx, oy - my].map(c => Math.min(1, Math.max(-1, c)))
                this.move([dx,dy])
            }
        })
    }
}

class Rope {
    get head() { return this.knots[0] }
    get tail() { return this.knots.at(-1) }

    constructor(length) {
        this.knots = []
        for (let i = 0; i < length; i++) {
            const knot = new Knot()
            if (this.knots.length > 0) {
                knot.follow(this.knots.at(-1))
            }
            this.knots.push(knot)
        }
    }

    move(moves) {
        for (const [v, by] of moves) {
            for (let _ = 0; _ < by; _++) {
                this.head.move(v)
            }
        }
        return this
    }
}

const data = require('fs')
    .readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => line.split(' '))
    .map(([dir, by]) => [vs[dir], Number(by)])

console.log(`part 1\n${new Rope(2).move(data).tail.uniquePositions}`)
console.log(`part 2\n${new Rope(10).move(data).tail.uniquePositions}`)