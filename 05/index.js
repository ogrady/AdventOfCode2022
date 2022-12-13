function processFile(file) {
	const stacks = {}
    const lines = require('fs')
        .readFileSync(file, 'utf-8')
        .split('\n')
        .filter(Boolean)
    let line
    // assume containers until we encounter the numbering line
    while (!(line = lines.shift()).startsWith(' 1')) {
        // parse one line of the input
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '[') {
                const item = line[i + 1]
                const stack = Math.ceil(i / 4) + 1
                stacks[stack] = (stacks[stack] ?? []).concat([item])
                i += 2  // skip ahead beyond closing bracket
            }
        }
    }
    // rest is instructions
    const instructions = []
    while (line = lines.shift()) {
        const [_, count, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/)
        instructions.push({count: Number(count), from, to})
    }
    return {stacks, instructions}
}

function crateMover9000({stacks, instructions}) {
    for(const {count, from, to} of instructions) {
        for (let i = 0; i < count; i++) {
            stacks[to] = (stacks[to] ?? [])
            stacks[to].unshift(stacks[from].shift())
        }
    }
    return stacks
}

function crateMover9001({stacks, instructions}) {
    for(const {count, from, to} of instructions) {
        const tmp = []
        for (let i = 0; i < count; i++) {
            tmp.push(stacks[from].shift())
        }
        stacks[to] = (stacks[to] ?? [])
        stacks[to].unshift(...tmp)
    }
    return stacks
}

const top = stacks => Object.values(stacks).map(stack => stack[0]).join('')

console.log(`--- part 1---\n${top(crateMover9000(processFile('./input.txt')))}`)
console.log(`--- part 2---\n${top(crateMover9001(processFile('./input.txt')))}`)