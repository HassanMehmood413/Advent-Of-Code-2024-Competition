const fs = require('fs');
const { PriorityQueue } = require('@datastructures-js/priority-queue');

// Parse the maze input
function parseMaze(inputStr) {
    const maze = inputStr.trim().split('\n').map(line => [...line]);
    let start = null, end = null;

    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 'S') start = [x, y];
            if (cell === 'E') end = [x, y];
        });
    });

    return { maze, start, end };
}

// Solve the maze using Dijkstra's algorithm
function solveMaze(inputStr) {
    const { maze, start, end } = parseMaze(inputStr);

    // Define movement directions: [dx, dy, direction name]
    const directions = [
        [0, -1, 'N'], // North
        [1, 0, 'E'],  // East
        [0, 1, 'S'],  // South
        [-1, 0, 'W']  // West
    ];

    const directionMap = directions.reduce((map, dir, index) => {
        map[dir[2]] = index;
        return map;
    }, {});

    // Priority queue for Dijkstra's
    const pq = new PriorityQueue((a, b) => a.cost - b.cost);
    pq.enqueue({ cost: 0, x: start[0], y: start[1], facing: 'E' });

    // Visited set: (x, y, facing)
    const visited = new Set();

    while (!pq.isEmpty()) {
        const { cost, x, y, facing } = pq.dequeue();

        // If reached the end, return the cost
        if (x === end[0] && y === end[1]) {
            return cost;
        }

        const visitKey = `${x},${y},${facing}`;
        if (visited.has(visitKey)) continue;
        visited.add(visitKey);

        // Current direction index
        const currentDirIndex = directionMap[facing];

        // Explore neighbors
        for (let i = 0; i < directions.length; i++) {
            const [dx, dy, newDir] = directions[i];
            const nx = x + dx, ny = y + dy;

            if (i === currentDirIndex) {
                // Forward movement
                if (maze[ny] && maze[ny][nx] && maze[ny][nx] !== '#') {
                    pq.enqueue({ cost: cost + 1, x: nx, y: ny, facing: newDir });
                }
            } else {
                // Turning movement (clockwise or counterclockwise)
                const turnCost = 1000;
                pq.enqueue({ cost: cost + turnCost, x, y, facing: newDir });
            }
        }
    }

    return Infinity; // No solution found
}

// Read input from file
const inputStr = fs.readFileSync('input.txt', 'utf-8');

// Solve the maze
const result = solveMaze(inputStr);
console.log("Lowest score:", result);
