These are my solutions (and my inputs) to the [Advent of Code 2022](https://adventofcode.com/2022/) 🎄

I did them all in pure Node.js.

As I was sharing and discussing my solutions in a Discord server, I tried to golf them into the message limit of 2000 characters. This sometimes severely hurt readability, I'm afraid.

# Day 1
Nice warmup.

# Day 2
-

# Day 3
I fully expected the [Knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem).

# Day 4
-

# Day 5
-

# Day 6
-

# Day 7
-

# Day 8
-

# Day 9
-

# Day 10
-

# Day 11
Many stumbled over part 2 on this one, including me. The trick is to keep the intermediate `worryLevel` small, which we can do by regularily applying `% n` to it (we can actually do this whenever we want, but have to do it before the `worryLevel` overflows our number range).
`n` has to be selected in a way that dividing by it does not affect divisibility of future divisors. We can calculate `n` ahead as we know what numbers we will divide the `worryLevel` by (as we know the numbers `x` each Monkey tries to divide the `worryLevel` by). We can simply use the _least common multiple_ of these `x`s. As they are conveniently all prime numbers, we can just multiply them with each other to find our `n`.

# Day 12
I hated solving this task with passion. Which is actually on me, as I had to chase a bug in my grid initialisation for half a day. From then on it's just Dijkstra.
Dijkstra is a "one to all" pathfinding algorithm, meaning that it will find the path for one particular starting position to all other positions in the grid.
We can use this property for part 2. Instead of searching the path from each `a` to `E`, we instead start at `E`. We then know the shortest path to each `a` (and all other positions).
I had to use another trick on top: the paths in this graph are directed. Meaning the costs to move from `x` to `y` are different from the costs for moving from `y` to `x`. As my `cost` function subtracts the ASCII code of the characters I want to check the travel cost for, I have to make sure they are not negative when I reverse the direction, as all costs have to be positive for the Dijkstra algorithm to work.
So I not only had to reverse the direction I was searching into, but also "flip" all characters, so that `a` would become `z`, `b` would by `y` (and the other way around), and so on.

# Day 13
-

# Day 14
This one's a little tricky because it assumes an endless floor in part 2. So you actually have to handle sand the piles up for quite a bit. With my implementation of having a pre-built grid, I had to wind my way around this. I basically added the maximum extent the sand would need to pile up all the way to the top if nothing obstructed it. In that case, the sand would form a right-angled rectangle of which we know one edge and an angle. The edge is pretty obviously the maximum height in our input. The angle is 45°. That's because the sand would distribute evenly left to right, forming a 90° angle. I only needed half of that, as I wanted to know how far the sand can stretch _in each direction_, so my angle was 45°. I could then add this much width to my grid and shift each coordinate used in the input by that amount as well.
Actually, I am not totally sure I got it right and I could just have added an arbitrary but sufficiently large extra space to my grid, but that did the trick for me.

# Day 15
Another puzzle that is practically immune to brute force. I started with a naive solution, then my memory exploded. So I went back to the whiteboard.
For the first part, I project the signals from all sensors to the desired y-value.
For the second part I stole the general idea [from Reddit](https://www.reddit.com/r/adventofcode/comments/zmcn64/comment/j0czott/?utm_source=reddit&utm_medium=web2x&context=3). I don't have to check _all_ coordinates, just the ones that are one unit outside of each sensor's range. We are basically looking at a polygon (the merge diamonds the signals form) with a single hole in it. That single hole has to be one unit outside of some sensor's range, or else it would be within another sensor's range or we wouldn't have any hole in our polygon (which contradicts the task).
Could probably have come up with some more elegant trigonometry to walk along the circle, but I am already too tired at this point. Good night.

# Day 16
-

# Day 17
-

# Day 18
-

# Day 19
-

# Day 20
-

# Day 21
-

# Day 22
-

# Day 23
-

# Day 24
-