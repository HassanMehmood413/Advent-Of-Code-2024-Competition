const fs = require('fs');
const PriorityQueue = require('js-priority-queue');

function readInput(filename) {
    return fs.readFileSync(filename, 'utf-8').split('\n').map(line => line.trim());
}

function findStartEnd(grid) {
    let start = null;
    let end = null;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'S') start = [i, j];
            if (grid[i][j] === 'E') end = [i, j];
        }
    }

    return { start, end };
}

function getNeighbors(pos, grid, cheating = false) {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    const neighbors = [];
    for (const [dy, dx] of directions) {
        const newY = pos[0] + dy;
        const newX = pos[1] + dx;

        if (
            newY >= 0 && newY < grid.length &&
            newX >= 0 && newX < grid[0].length &&
            (cheating || grid[newY][newX] !== '#')
        ) {
            neighbors.push([newY, newX]);
        }
    }

    return neighbors;
}

function findReachablePositions(grid, start, maxSteps) {
    const distances = { [start.toString()]: 0 };
    const pq = new PriorityQueue({ comparator: (a, b) => a[0] - b[0] });
    pq.queue([0, start]);

    while (pq.length > 0) {
        const [dist, current] = pq.dequeue();

        if (dist > maxSteps) continue;

        for (const next of getNeighbors(current, grid, true)) {
            const newDist = dist + 1;
            const key = next.toString();

            if (newDist <= maxSteps && (!distances[key] || newDist < distances[key])) {
                distances[key] = newDist;
                pq.queue([newDist, next]);
            }
        }
    }

    return distances;
}

function shortestPath(grid, start, end) {
    const distances = { [start.toString()]: 0 };
    const pq = new PriorityQueue({ comparator: (a, b) => a[0] - b[0] });
    pq.queue([0, start]);

    while (pq.length > 0) {
        const [dist, current] = pq.dequeue();

        if (dist > distances[current.toString()]) continue;

        for (const next of getNeighbors(current, grid)) {
            const newDist = dist + 1;
            const key = next.toString();

            if (!distances[key] || newDist < distances[key]) {
                distances[key] = newDist;
                pq.queue([newDist, next]);
            }
        }
    }

    return distances;
}

function findCheats(grid, normalDistances, start, end) {
    const MAX_CHEAT_LENGTH = 20;
    const savings = {};
    const height = grid.length;
    const width = grid[0].length;

    for (let y1 = 0; y1 < height; y1++) {
        for (let x1 = 0; x1 < width; x1++) {
            if (grid[y1][x1] === '#') continue;
            const pos1 = [y1, x1];
            const key1 = pos1.toString();

            if (!(key1 in normalDistances)) continue;

            const reachable = findReachablePositions(grid, pos1, MAX_CHEAT_LENGTH);

            for (const [key2, cheatLength] of Object.entries(reachable)) {
                const pos2 = key2.split(',').map(Number);

                if (grid[pos2[0]][pos2[1]] === '#') continue;

                if (key1 in normalDistances && key2 in normalDistances) {
                    const normalTime = normalDistances[end.toString()];
                    const cheatTime = normalDistances[key1] + cheatLength + (normalDistances[end.toString()] - normalDistances[key2]);

                    if (cheatTime < normalTime) {
                        const saved = normalTime - cheatTime;
                        savings[saved] = (savings[saved] || 0) + 1;
                    }
                }
            }
        }
    }

    return savings;
}

function solve(grid) {
    const { start, end } = findStartEnd(grid);

    const cleanGrid = grid.map(row => row.replace('S', '.').replace('E', '.'));

    const normalDistances = shortestPath(cleanGrid, start, end);
    const savings = findCheats(cleanGrid, normalDistances, start, end);

    return Object.entries(savings)
        .filter(([saved]) => saved >= 100)
        .reduce((sum, [, count]) => sum + count, 0);
}

function main() {
    const grid = readInput('input.txt');
    const result = solve(grid);
    console.log(`Number of cheats saving at least 100 picoseconds: ${result}`);
}

main();
