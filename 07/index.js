class AFile {
    constructor(name) { 
        this.name = name 
    }
}

class File extends AFile {
    constructor(name, size) { 
        super(name)
        this.size = size 
    }
    
    getSize() { return this.size }
}

class Directory extends AFile  {
    constructor(name) { 
        super(name)
        this.files = [] 
    }

    getSize() { return this.files.reduce((total, f) => total + f.getSize(), 0) }

    flatten() {
        const dirs = this.files.filter(f => f instanceof Directory)
        return dirs.reduce((agg, dir) => agg.concat(dir.flatten()), dirs)
    }
}

function reconstructFs(input) {
    const cwd = []
    let cmd
    while (cmd = input.shift()) {
        if (cmd === '$ cd /') {
            cwd.push(new Directory('/'))
        } else if (cmd === '$ ls') {
        } else if (cmd.startsWith('dir')) {
            cwd.at(-1).files.push(new Directory(cmd.slice('dir '.length)))
        } else if (cmd.startsWith('$ cd')) {
            cmd = cmd.slice('$ cd '.length)
            if (cmd === '..') {
                cwd.pop()
            } else {     
                cwd.push(cwd.at(-1).files.find(f => f.name === cmd))
            }
        } else {
            const [, size, name] = cmd.match(/(\d+) (.+)/)
            cwd.at(-1).files.push(new File(name, Number(size)))
        }
    }
    return cwd[0]
}

const fs = reconstructFs(require('fs').readFileSync('./input.txt', 'utf-8').split('\n'))
const required = 30_000_000 - 70_000_000 + fs.getSize()
const dirs = fs.flatten()
const total = dirs.filter(d => d.getSize() <= 100_000).reduce((agg, d) => agg + d.getSize(), 0)
const deletionCandidate = dirs.map(d => [d, d.getSize() - required])
    .filter(([, difference]) => difference >= 0)
    .sort(([,x], [,y]) => x - y)
    .at(0)[0]

console.log(`part1\n${total}`)
console.log(`part2\n${deletionCandidate.getSize()}`)