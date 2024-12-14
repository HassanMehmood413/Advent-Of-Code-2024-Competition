const fs = require('fs');

// Parse input file to extract robot positions and velocities
function parseInput(filename) {
    const robots = [];
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split('\n');

    lines.forEach(line => {
        const [posStr, velStr] = line.trim().split(' ');
        const [px, py] = posStr.slice(2).split(',').map(Number);
        const [vx, vy] = velStr.slice(2).split(',').map(Number);
        robots.push([[px, py], [vx, vy]]);
    });

    return robots;
}

// Simulate robot movements and count robot positions after given time
function simulateRobots(robots, time, width, height) {
    // Initialize grid to track robot positions
    const grid = Array.from({ length: height }, () => Array(width).fill(0));

    robots.forEach(([position, velocity]) => {
        const [px, py] = position;
        const [vx, vy] = velocity;

        // Calculate final position after time, with wraparound
        const finalX = (px + vx * time) % width;
        const finalY = (py + vy * time) % height;
        grid[finalY][finalX] += 1;
    });

    return grid;
}

// Check if the robot positions form a Christmas tree pattern
function isChristmasTree(grid) {
    // Define a potential Christmas tree pattern
    const treePattern = [
        [0, 0, 1, 0, 0],  // top of tree
        [0, 1, 1, 1, 0],  // middle of tree
        [1, 1, 1, 1, 1],  // base of tree
    ];

    const height = grid.length;
    const width = grid[0].length;

    // Search for the pattern in the grid
    for (let y = 0; y < height - treePattern.length; y++) {
        for (let x = 0; x < width - treePattern[0].length; x++) {
            let match = true;
            for (let dy = 0; dy < treePattern.length; dy++) {
                for (let dx = 0; dx < treePattern[dy].length; dx++) {
                    if (treePattern[dy][dx] === 1 && grid[y + dy][x + dx] === 0) {
                        match = false;
                        break;
                    }
                }
                if (!match) break;
            }

            if (match) {
                return true;
            }
        }
    }

    return false;
}

// Find the earliest time when robots form a Christmas tree pattern
function findChristmasTreeTime(filename, maxTime = 10000, width = 101, height = 103) {
    // Parse input
    const robots = parseInput(filename);

    // Search for Christmas tree pattern
    for (let time = 0; time < maxTime; time++) {
        // Simulate robot positions
        const grid = simulateRobots(robots, time, width, height);

        // Check for Christmas tree pattern
        if (isChristmasTree(grid)) {
            return time;
        }
    }

    return -1; // No pattern found within maxTime
}

// Solve problem
const result = findChristmasTreeTime('input.txt');
console.log(`Seconds until Christmas Tree Pattern: ${result}`);
