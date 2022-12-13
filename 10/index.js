class Processor {
    static toCommands = lines => lines.map(l => {
        const [, cmd, value] = l.match(/(\S*)(?:\s(-?\d+))?/)
        return cmd === 'noop' 
            ? [[Processor.prototype.noop, []]]
            : [[Processor.prototype.noop, []], [Processor.prototype.addx, [Number(value)]]]
        }).flat()

    constructor() {
        this.cycle = 1
        this.x = 1
        this.crt = ''
    }

    addx(v) {
        this.x += v
        this.cycle++        
    }

    noop() {
        this.cycle++
    }

    render() {
        const column = (this.cycle - 1) % 40
        this.crt += Math.abs(column - this.x) <= 1 ? '#' : '.'
        if (column === 39) { this.crt += '\n' }  // 1-based and after increment
    }

    execute(commands, isInterestingCycle = cs => false) {
        const cyclesOfInterest = {}
        for (const [cmd, args] of commands) {
            this.render()
            cmd.bind(this)(...args)
            if (isInterestingCycle(this.cycle)) {
                cyclesOfInterest[this.cycle] = this.x
            }
        }
        return cyclesOfInterest
    }
}

const commands = Processor.toCommands(require('fs')
    .readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean))

const p = new Processor()
const coi = p.execute(commands, c => [20, 60, 100, 140, 180, 220].includes(c))
const signalStrengthSum = Object.entries(coi).map(([k,v]) => Number(k) * v).reduce((x,y) => x+y, 0)
console.log(`--- part 1 ---\n${signalStrengthSum}`)
console.log(`--- part 2 ---\n${p.crt}`)