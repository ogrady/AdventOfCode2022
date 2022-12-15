const manhatten = ([sx, sy], [dx, dy]) => Math.abs(sx - dx) + Math.abs(sy - dy)

const data = require('fs')
  .readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(l => {
    const [sx, sy, bx, by] = l.match(/Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/).slice(1).map(Number)
    return { sensor: [sx, sy], beacon: [bx, by], distance: manhatten([sx, sy], [bx, by]) }
  })

function projectSignals(data, scanline) {
  const xs = new Set()
  for ({ sensor: [sx, sy], beacon: [bx, by], distance } of data) {
    if (Math.abs(sy - scanline) <= distance) {
      let h = 1
      for (let x = sx - distance; x < sx + distance; x++) {
        if (sy - h < scanline && scanline < sy + h) {
          xs.add(x)
        }
        h += x < sx ? 1 : -1
      }
      if (by === scanline) { xs.delete(bx) }
    }
  }
  return xs
}

function* manhattenCircle({ sensor: [sx, sy], distance }) {
  distance++
  const deltas = [[-1, 1], [-1, -1], [1, -1], [1, 1]]
  let [i, j] = [distance, 0]
  while (deltas.length > 0) {
    const [dx, dy] = deltas.shift()
    do {
      i += dx
      j += dy
      yield [sx + i, sy + j]
    } while (Math.abs(i) !== distance && Math.abs(j) !== distance)
  }
}

// https://www.reddit.com/r/adventofcode/comments/zmcn64/comment/j0czott/?utm_source=reddit&utm_medium=web2x&context=3
function scan(data, max) {
  for (const reading of data) {
    for (const [x, y] of manhattenCircle(reading)) {
      if (0 <= x && x <= max && 0 <= y && y <= max) {
        let covered = false
        let i = 0
        while (!covered && i < data.length) {
          const { sensor, distance } = data[i]
          covered = manhatten(sensor, [x, y]) <= distance
          i++
        }
        if (!covered) {
          return [x, y]
        }
      }
    }
  }
}

const [x, y] = scan(data, 4_000_000)
console.log(`--- part 1 ---\n${projectSignals(data, 2_000_000).size}`)
console.log(`--- part 2 ---\n${4_000_000 * x + y}`)