const fs = require('fs')

const toPriority = c => '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c)

const data = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean)

const compartments = data 
    .map(line => [Array.from(line.slice(0, line.length/2)), Array.from(line.slice(line.length/2))]) // half each string into [,]
    .map(([compA, compB]) => compA.find(c => compB.includes(c)))
    .reduce((sum, character) => sum + toPriority(character), 0)

const groups = data
    .reduce((gs, line) => {
        if (gs[0].length < 3) {
            gs[0].push(line)
        } else {
            gs.unshift([line])
        }
        return gs
    }, [[]])
    .map(group => {
        const counted = group
            .map(g => new Set(g))  // make sure each letter only shows up once per rucksack
            .reduce((all, set) => { all.push(...set); return all }, [])
            .reduce((counter, c) => { counter[c] = (counter[c] ?? 0) + 1; return counter }, {})
        return Object.entries(counted).find(([k,v]) => v === 3)[0]
    })
    .reduce((sum, g) => sum + toPriority(g), 0)

console.log('--- part 1 ---')
console.log(compartments)
console.log('--- part 2 ---')
console.log(groups)