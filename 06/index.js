class Buffer {
    constructor(capacity) {
        this.inner = []
        this.pushes = 0
        this.capacity = capacity
    }

    push(x) {
        if (this.inner.length >= this.capacity) {
            this.inner.shift()
        }
        this.inner.push(x)
        this.pushes++
    }

    allUnique() {
        return new Set(this.inner).size === this.capacity
    }

    pushUntilUnique(ss) {
        while (!this.allUnique() && ss.length > 0) {
            this.push(ss.shift())
        }       
    }
}

const marker = new Buffer(4)
const message = new Buffer(14)

marker.pushUntilUnique(require('fs').readFileSync('./input.txt', 'utf-8').split(''))
message.pushUntilUnique(require('fs').readFileSync('./input.txt', 'utf-8').split(''))

console.log(`--- part 1 ---\n${marker.pushes}`)
console.log(`--- part 2 ---\n${message.pushes}`)