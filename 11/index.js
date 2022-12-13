const read = () => require('fs')
  .readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(l => l.trim())

class Monkey {
  static instances = []
  static LCM = 1

  static parseMonkeys(lines) {
    Monkey.instances = []
    const p = r => lines.shift().match(r)[1]

    while (lines.length > 0) {
      new Monkey(
        Number(p(/^Monkey (\d+):/)),
        p(/^Starting items: (.*)/).split(', ').map(Number),
        eval(`old => ${p(/^Operation: new = (.*)/)}`),
        Number(p(/^Test: divisible by (\d+)/)),
        Number(p(/^If true: throw to monkey (\d+)/)),
        Number(p(/^If false: throw to monkey (\d+)/))
      )
    }

    Monkey.LCM = Monkey.instances.reduce((m, monkey) => m * monkey.mod, 1)
  }

  constructor(id, items, operation, mod, iftrue, iffalse) {
    this.id = id
    this.items = items
    this.operation = operation
    this.mod = mod
    this.condition = v => v % mod === 0,
    this.iftrue = iftrue
    this.iffalse = iffalse
    this.inspectionCount = 0
    Monkey.instances.push(this)
  }

  turn(relief) {
    while (this.items.length > 0) {
      const item = this.items.shift()
      const worryLevel = Math.floor(this.operation(item) / relief) % Monkey.LCM
      const targetId = this.condition(worryLevel) ? this.iftrue : this.iffalse
      Monkey.instances.find(m => m.id === targetId).items.push(worryLevel)
      this.inspectionCount++
    }
  }
}

function part(relief, rounds) {
  Monkey.parseMonkeys(read())

  for (let i = 0; i < rounds; i++) {
    for (const m of Monkey.instances) {
      m.turn(relief)
    }
  }

  const hustlers = Monkey.instances.sort((m1, m2) => m2.inspectionCount - m1.inspectionCount)
  return hustlers[0].inspectionCount * hustlers[1].inspectionCount
}

console.log(`part 1\n${part(3, 20)}`)
console.log(`part 2\n${part(1, 10_000)}`)