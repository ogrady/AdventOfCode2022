const read = () => require('fs').readFileSync('./input.txt', 'utf-8').split('\n').filter(Boolean).map(l => l.split(''))
const hash = ([x,y]) => `${x}|${y}`
const unhash = s => s.split('|').map(Number)
const range = n => [...Array(n).keys()]
const dim = field => [field.length, field[0].length]
const fill2d = (w,h,x) => new Array(w).fill().map(() => Array(h).fill(x))
const invert = c => {
  // inverts lower case character. a → z, b → y, z → a, ...
  const from = 'a'.charCodeAt(0)
  const to = 'z'.charCodeAt(0)
  const rpoint = from + (to - from) / 2
  const cc = c.charCodeAt(0)
  return cc < from || cc > to ? c : String.fromCharCode(cc + (2 * (rpoint - cc)))
}
const modify = (grid, f) => {
  // modifies grid by reference by applying f() to each element
  for (let i = 0; i < inverted.length; i++) {
    for (let j = 0; j < inverted[i].length; j++) {
      inverted[i][j] = f(inverted[i][j])
    }
  }
}

function find(grid, char) {
  // finds coordinates of all occurences of char in grid
  const results = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === char) { results.push([i,j]) }
    }
  }
  return results
}

function cost(field, [fromX, fromY], [toX, toY]) {
  const from = field[fromX]?.[fromY]
  const to = field[toX]?.[toY]

  if ((!from || !to) || Math.abs(fromX - toX) !== 1 && Math.abs(fromY - toY) !== 1) { return Infinity }

  const dist = from.charCodeAt(0) - to.charCodeAt(0)
  return dist < -1 ? Infinity : dist + 1 // to allow -1 without having negative weights
}

function neighbours(field, [x, y]) {
  // coordinates of reachable neighbours in cardinal directions
  return [[-1, 0], [1, 0], [0, -1], [0, 1]]
    .map(([dx, dy]) => [[x + dx, y + dy], cost(field, [x, y], [x + dx, y + dy])])
    .filter(([, cost]) => cost < Infinity)
    .map(([n,]) => n)
}

function normalise(field) {
  // replaces every 'S' with 'a' and every 'E' with 'z' by reference and returns their respective coordinates.
  const [[sx, sy],] = find(field, 'S')
  const destinations = find(field, 'E')
  field[sx][sy] = 'a'
  for (const [dx,dy] of destinations) {
    field[dx][dy] = 'z'
  }  
  return [[sx, sy], destinations]
}

function dijkstra(field, [sx, sy]) {
  // for more horribly inefficient implementations of well-known algorithms follow me on TikTok!
  const [w, h] = dim(field)
  const queue = new Set(range(w).map(x => range(h).reduce((agg, y) => agg.concat([[x, y]]), [])).flat().map(hash))
  const costs = fill2d(w, h, Infinity)
  const parents = fill2d(w, h, undefined)

  costs[sx][sy] = 0

  while (queue.size > 0) {
    let [minx, miny, c] = [Infinity, Infinity, Infinity]
    for (const xy of queue) {
      const [x, y] = unhash(xy)
      if (costs[x][y] < c) {
        [minx, miny, c] = [x, y, costs[x][y]]
      }
    }
    // no more reachable fields
    if (c === Infinity) { queue.clear() } 
    queue.delete(hash([minx, miny]))

    for (const [nx, ny] of neighbours(field, [minx, miny]).filter(n => queue.has(hash(n)))) {
      const d = costs[minx][miny] + 1
      if (d < costs[nx][ny]) {
        costs[nx][ny] = d
        parents[nx][ny] = [minx, miny]
      }
    }
  }
  return parents
}

function path(field) {
  const [[sx, sy], dests] = normalise(field)
  const parents = dijkstra(field, [sx, sy])
  return dests.map(([dx, dy]) => {
    const nodes = [[dx, dy]]
    while (hash(nodes.at(0)) !== hash([sx, sy])) {
      const [x, y] = nodes.at(0)
      if (parents[x][y] === undefined) {
        return undefined // node is a destination but unreachable → bail
      }
      nodes.unshift(parents[x][y])
    }
    return nodes
  }).filter(Boolean)
}

const shortest = path(read())[0].length - 1  // -1, as we want the number of edges, not nodes
const inverted = read()
modify(inverted, invert)
modify(inverted, s => s === 'E' 
  ? 'S'
  : s === 'S' || s === 'z'
  ? 'E'
  : s
)
const prettiest = Math.min(...path(inverted).map(p => p.length - 1))

console.log(`--- part 1 ---\n${shortest}`)
console.log(`--- part 1 ---\n${prettiest}`)