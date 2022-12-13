const data = require('fs').readFileSync('./input.txt', 'utf-8').split('\n').filter(Boolean).map(JSON.parse)
const isNum = n => typeof n === 'number'

const comp = (l, r) => {
    if (isNum(l) && isNum(r)) { return l - r }
    if (isNum(l)) { l = [l] }
    if (isNum(r)) { r = [r] }
    let i = 0
    while (i < l.length && i < r.length) {
        const d = comp(l[i], r[i])
        if (d !== 0) { return d }
        i++
    }    
    return l.length - r.length
}

let correct = 0
for (let i = 0; i < data.length; i += 2) {
    const order = comp(data[i], data[i + 1])
    if (order < 0) {
        correct += Math.ceil(i / 2) + 1
    }
}

data.push([[2]], [[6]])
data.sort(comp)

const dividers = Object.entries(data)
    .filter(([,v]) => ['[[2]]', '[[6]]'].includes(JSON.stringify(v)))
    .reduce((mult, [k,]) => mult *= Number(k) + 1, 1)

console.log(`--- part 1 ---\n${correct}`)
console.log(`--- part 2 ---\n${dividers}`)