const fs = require('fs');
const PriorityQueue = require('js-priority-queue');

function readInput(filename) {
    return fs.readFileSync(filename, 'utf-8').split('\n').map(line => line.trim());
}

function findStartEnd(grid) {
    let start = null, end = null;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'S') start = [i, j];
            if (grid[i][j] === 'E') end = [i, j];
        }
    }

    return { start, end };
}

function getNeighbors(pos, grid) {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const neighbors = [];
    const [y, x] = pos;

    for (const [dy, dx] of directions) {
        const newY = y + dy;
        const newX = x + dx;

        if (
            newY >= 0 && newY < grid.length &&
            newX >= 0 && newX < grid[0].length &&
            grid[newY][newX] !== '#'
        ) {
            neighbors.push([newY, newX]);
        }
    }

    return neighbors;
}

function shortestPath(grid, start, end) {
    const distances = {};
    const pq = new PriorityQueue({ comparator: (a, b) => a[0] - b[0] });

    distances[start] = 0;
    pq.queue([0, start]);

    while (pq.length > 0) {
        const [dist, current] = pq.dequeue();

        if (dist > distances[current]) continue;

        for (const next of getNeighbors(current, grid)) {
            const newDist = dist + 1;

            const key = next.toString();
            if (!(key in distances) || newDist < distances[key]) {
                distances[key] = newDist;
                pq.queue([newDist, next]);
            }
        }
    }

    return distances;
}

function findCheats(grid, normalDistances, start, end) {
    const height = grid.length;
    const width = grid[0].length;
    const savings = {};

    for (let y1 = 0; y1 < height; y1++) {
        for (let x1 = 0; x1 < width; x1++) {
            if (grid[y1][x1] === '#') continue;

            const pos1 = `${y1},${x1}`;
            if (!(pos1 in normalDistances)) continue;

            for (let y2 = 0; y2 < height; y2++) {
                for (let x2 = 0; x2 < width; x2++) {
                    if (grid[y2][x2] === '#') continue;

                    const pos2 = `${y2},${x2}`;
                    const manhattanDist = Math.abs(y2 - y1) + Math.abs(x2 - x1);
                    if (manhattanDist > 2) continue;

                    if (pos1 in normalDistances && pos2 in normalDistances) {
                        const normalTime = normalDistances[end.toString()];
                        const cheatTime = normalDistances[pos1] + manhattanDist + (normalDistances[end.toString()] - normalDistances[pos2]);

                        if (cheatTime < normalTime) {
                            const saved = normalTime - cheatTime;
                            savings[saved] = (savings[saved] || 0) + 1;
                        }
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
