const contained = ([x1, x2], [y1, y2]) => x1 <= y1 && y2 <= x2
const overlaps = ([x1, x2], [y1, y2]) => x1 <= y2 && y1 <= x2

const data = require('fs').readFileSync('./input.txt', 'utf-8').split('\n').filter(Boolean)
const elfs = data.map(line => line.split(',').map(range => range.split('-').map(Number)))
const fullyContained = elfs.filter(([r1, r2]) => contained(r1, r2) || contained(r2, r1))
const overlapping = elfs.filter(([r1, r2]) => overlaps(r1, r2) || overlaps(r2, r1))

console.log(`--- part 1 ---\n${fullyContained.length}`)
console.log(`--- part 2 ---\n${overlapping.length}`)