const fs = require('fs')

const RPS = {
    SCISSORS: 3,
    PAPER: 2,
    ROCK: 1,
}

// what? It's the mathematical modulo. But stupid. And restricted to this very use case.
const mod = a => a === 2 ? -1 : a === -2 ? 1 : a

// -1: I lost, 0: draw, 1: I won
const play = (me, opponent) => mod(me - opponent)

const winScore = (won) => ({
    '-1': 0,
       0: 3,
       1: 6
})[won]

const score = (me, opponent) => me + winScore(play(me, opponent))

const translate1 = (letter) => ({
    A: RPS.ROCK,
    X: RPS.ROCK,
    B: RPS.PAPER,
    Y: RPS.PAPER,
    C: RPS.SCISSORS,
    Z: RPS.SCISSORS
})[letter]

const translate2 = (letter, opponent) => {
    const opponentMove = translate1(opponent)
    switch (letter) {
        // lose
        case 'X': return Object.values(RPS).find(move => play(move, opponentMove) === -1)
        // draw
        case 'Y': return opponentMove  
        // win
        case 'Z': return Object.values(RPS).find(move => play(move, opponentMove) === 1)
    }
}

const input = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean) // remove empty lines (last line in file)
    .map(([a, _, b]) => a + b)  // remove space separator

const finalScorePart1 = input
    .reduce((total, [opponent, me]) => total + score(translate1(me), translate1(opponent)), 0)

const finalScorePart2 = input
    .reduce((total, [opponent, me]) => total + score(translate2(me, opponent), translate1(opponent)), 0)

console.log('--- part 1 ---')
console.log(finalScorePart1)
console.log('--- part 2 ---')
console.log(finalScorePart2)