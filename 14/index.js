const data = require('fs')
    .readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(l => l.split('->')  // "a,b -> c,d -> e,f -> …"
                .map(coord => coord.split(',').map(Number)))  // ["a","b"], ["b","c"], ["d","e"], … 

class Grid {  
    constructor(width, height, centre) {
        this.extra = Math.ceil(Math.sin(45) * centre)
        width += this.extra * 2 - centre / 2
        this.grid = Array(width).fill().map(() => Array(height).fill('.'))
    }

    at([x,y], v) {
        x += this.extra
        if (v) { this.grid[x][y] = v }
        return this.grid[x][y]
    }

    addFloor(y) {
        for (let x = 0; x < this.grid.length; x++) {
            this.grid[x][y] = '#'  // direct access again
        }
    }

    addPath(path) {
        let [posX, posY] = path.shift()
        while (path.length > 0) {
            const [destX, destY] = path.shift()
            do {
                this.at([posX, posY], '#')
                const [dx, dy] = [destX - posX, destY - posY].map(d => Math.max(-1, Math.min(d, 1)))
                posX += dx
                posY += dy
            } while (!(posX === destX && posY === destY))
            this.at([posX,posY], '#')
        }
    }

    sweep() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] === 'o') {
                    this.grid[i][j] = '.'  // direct access as we want to check all cells
                }
            }
        }
    }

    isFree([x, y]) {
        const symbol = this.at([x,y])
        if (!symbol) { throw new Error('abyss') }
        return symbol === '.'
    }

    trickle([sandX, sandY]) {
        if (!this.isFree([sandX, sandY])) return false
        try {
            let moved = true
            while (moved) {
                moved = false
                const moves = [[0,1],[-1,1],[1,1]]
                while (!moved && moves.length > 0) {
                    const [dx, dy] = moves.shift()
                    if (this.isFree([sandX + dx, sandY + dy])) {
                        sandX += dx
                        sandY += dy
                        moved = true
                    }
                }
            }
            this.at([sandX,sandY], 'o')
            return true
        } catch (e) { return false }
    }

    toString() { return this.grid.map(l => l.join('')).join('\n') }
}

const [width, height] = [Math.max(...data.flat().map(([x,]) => x)) + 1, Math.max(...data.flat().map(([,y]) => y)) + 1]

const grid = new Grid(width, height + 2, 500)
for (const p of data) {
    grid.addPath(p)
}

let sandCorns = 0
while(grid.trickle([500, 0])) {
    sandCorns++
}

grid.sweep()
grid.addFloor(height + 1)

let sandCorns2 = 0
while(grid.trickle([500, 0])) {
    sandCorns2++
}

console.log(`--- part 1 ---\n${sandCorns}`)
console.log(`--- part 2 ---\n${sandCorns2}`)