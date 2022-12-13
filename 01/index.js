const fs = require('fs')

const data = fs.readFileSync('./input.txt', 'utf-8')

const res = data.split('\n').reduce((agg, line) => {
    if (line) {  // no snack with 0 calories in input, so it's fine
        agg[0] += Number(line)
    } else {
        agg.unshift(0)
    }
    return agg
}, [0]).sort((a, b) => b - a)

console.log('--- part 1 ---')
console.log(res[0])
console.log('--- part 2 ---')
console.log(res.slice(0, 3).reduce((agg, x) => agg + x))