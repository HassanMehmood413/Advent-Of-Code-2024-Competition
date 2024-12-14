// Define grid dimensions
const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

// Function to parse input
function parseInput(inputFile) {
    const robots = [];
    const fs = require('fs');
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.split('\n');

    lines.forEach(line => {
        const match = line.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
        if (match) {
            const [_, px, py, vx, vy] = match.map(Number);
            robots.push([[px, py], [vx, vy]]);
        }
    });

    return robots;
}

// Simulate robots' movements
function simulateRobots(robots, seconds) {
    const positions = {};

    robots.forEach(([position, velocity]) => {
        const [px, py] = position;
        const [vx, vy] = velocity;

        // Calculate new position after 'seconds' time steps with wrapping
        const nx = (px + vx * seconds) % GRID_WIDTH;
        const ny = (py + vy * seconds) % GRID_HEIGHT;

        const key = `${nx},${ny}`;
        positions[key] = (positions[key] || 0) + 1;
    });

    return positions;
}

// Calculate the safety factor
function calculateSafetyFactor(positions) {
    // Initialize quadrants
    const quadrantCounts = [0, 0, 0, 0];

    for (const [key, count] of Object.entries(positions)) {
        const [x, y] = key.split(',').map(Number);

        if (x === GRID_WIDTH / 2 || y === GRID_HEIGHT / 2) {
            continue; // Exclude robots in the middle
        }

        if (x < GRID_WIDTH / 2 && y < GRID_HEIGHT / 2) {
            quadrantCounts[0] += count; // Top-left quadrant
        } else if (x >= GRID_WIDTH / 2 && y < GRID_HEIGHT / 2) {
            quadrantCounts[1] += count; // Top-right quadrant
        } else if (x < GRID_WIDTH / 2 && y >= GRID_HEIGHT / 2) {
            quadrantCounts[2] += count; // Bottom-left quadrant
        } else if (x >= GRID_WIDTH / 2 && y >= GRID_HEIGHT / 2) {
            quadrantCounts[3] += count; // Bottom-right quadrant
        }
    }

    // Calculate the product of robot counts in all quadrants
    return quadrantCounts.reduce((acc, count) => acc * count, 1);
}

// Main function
function main() {
    const inputFile = 'input.txt';

    // Parse input
    const robots = parseInput(inputFile);

    // Simulate for 100 seconds
    const positions = simulateRobots(robots, 100);

    // Calculate safety factor
    const safetyFactor = calculateSafetyFactor(positions);

    console.log(`Safety Factor: ${safetyFactor}`);
}

// Run the main function
main();
