const forest = require('fs')
    .readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => line.split('').map(Number))

function raycast(forest, [px, py], [vx, vy], height = -1) {
    const visible = []
    let tree = forest[px][py]
    while (tree !== undefined) {
        if (tree > height) {
            visible.push([px, py])
            height = tree
        } 
        px += vx
        py += vy
        tree = forest[px]?.[py]
    }
    return visible
}

function scenic(forest, [px, py], [vx, vy], height) {
    let tree
    let view = 0
    do {
        px += vx
        py += vy
        tree = forest[px]?.[py]
        if (tree !== undefined) {
            view++
            if (tree >= height) {
                tree = undefined  // stop
            }           
        }
    } while(tree !== undefined)
    return Math.max(1, view)
}

const rays = []
for (let row = 0; row < forest.length; row++) {
    rays.push([[0                , row], [ 1, 0]])
    rays.push([[forest.length - 1, row], [-1, 0]])
}
for (let col = 0; col < forest[0].length; col++) {
    rays.push([[col,                    0], [0,  1]])
    rays.push([[col, forest[0].length - 1], [0, -1]])
}

const visible = [...new Set(rays.reduce((full, [pos, velocity]) => full.concat(raycast(forest, pos, velocity)), [])  // ah, the joy of non-customisable set logic
        .map(([x,y]) => `${x}|${y}`))  // ah, the joy of FP in JS
    ].map(pos => pos.split('|').map(Number))


const scenics = []
for (let x = 1; x < forest.length - 1; x++) {
    for (let y = 1; y < forest[x].length - 1; y++) {
        scenics.push([[1,0],[-1,0],[0,1],[0,-1]].map(v => scenic(forest, [x,y], v, forest[x][y])).reduce((agg, x) => agg *= x, 1))
    }
}

console.log(`--- part 1 ---\n${visible.length}`)
console.log(`--- part 2 ---\n${Math.max(...scenics)}`)