const fs = require('fs');
const { PriorityQueue } = require('@datastructures-js/priority-queue');

// Function to read and parse input file
function parseInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data
        .trim()
        .split('\n')
        .map(line => line.split(',').map(Number));
}

// Simulates the corruption on the grid
function simulateMemoryCorruption(gridSize) {
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
}

// Checks if the coordinate (x, y) is valid and not corrupted
function isValid(x, y, grid) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid.length && grid[y][x] === 0;
}

// Finds the shortest path from top-left to bottom-right using A* algorithm
function shortestPath(grid) {
    const start = [0, 0];
    const end = [grid.length - 1, grid.length - 1];

    if (grid[start[1]][start[0]] === 1 || grid[end[1]][end[0]] === 1) {
        return -1; // No path if start or end is corrupted
    }

    // Priority queue: [cost, x, y]
    const pq = new PriorityQueue((a, b) => a[0] - b[0]);
    pq.enqueue([0, start[0], start[1]]);
    const visited = new Set();
    const directions = [
        [-1, 0], // Left
        [1, 0],  // Right
        [0, -1], // Up
        [0, 1]   // Down
    ];

    while (!pq.isEmpty()) {
        const [cost, x, y] = pq.dequeue();

        if (visited.has(`${x},${y}`)) {
            continue;
        }
        visited.add(`${x},${y}`);

        // Check if we reached the end
        if (x === end[0] && y === end[1]) {
            return cost;
        }

        // Explore neighbors
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny, grid) && !visited.has(`${nx},${ny}`)) {
                pq.enqueue([cost + 1, nx, ny]);
            }
        }
    }

    return -1; // No path found
}

// Finds the first blocking byte that prevents the exit from being reachable
function findBlockingByte(corruptedCoords, gridSize) {
    const grid = simulateMemoryCorruption(gridSize);

    for (const [idx, [x, y]] of corruptedCoords.entries()) {
        grid[y][x] = 1; // Add corruption
        if (shortestPath(grid) === -1) {
            return [x, y]; // Return the first blocking byte
        }
    }
    return null; // No blocking byte found
}

// Main function
function main() {
    const filePath = 'input.txt';
    const gridSize = 71; // Memory space dimensions (0 to 70 inclusive)
    const corruptedCoords = parseInput(filePath);

    // Find the first blocking byte
    const blockingByte = findBlockingByte(corruptedCoords, gridSize);

    if (blockingByte) {
        console.log(
            `The coordinates of the first byte that prevents the exit are: ${blockingByte[0]},${blockingByte[1]}`
        );
    } else {
        console.log('No blocking byte found.');
    }
}

main();
