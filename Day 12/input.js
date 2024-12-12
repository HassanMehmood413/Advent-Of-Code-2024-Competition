const fs = require('fs');

function readMap(filePath) {
    // Reads the garden map from the input file
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').map(line => line.trim().split(''));
}

function floodFill(grid, x, y, visited, plantType) {
    // Performs flood-fill to find a region and calculates its area and perimeter
    const rows = grid.length;
    const cols = grid[0].length;
    const stack = [[x, y]];
    let area = 0;
    let perimeter = 0;
    visited.add(`${x},${y}`);

    // Directions for movement: up, down, left, right
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        area++;

        for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                if (grid[nx][ny] === plantType) {
                    if (!visited.has(`${nx},${ny}`)) {
                        visited.add(`${nx},${ny}`);
                        stack.push([nx, ny]);
                    }
                } else {
                    // Edge of the region
                    perimeter++;
                }
            } else {
                // Edge of the grid
                perimeter++;
            }
        }
    }

    return { area, perimeter };
}

function calculateFencingCost(grid) {
    // Calculates the total fencing cost for the garden
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = new Set();
    let totalCost = 0;

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (!visited.has(`${x},${y}`)) {
                // Start a new region
                const plantType = grid[x][y];
                const { area, perimeter } = floodFill(grid, x, y, visited, plantType);
                totalCost += area * perimeter;
            }
        }
    }

    return totalCost;
}

function main() {
    // Read the garden map from the input file
    const filePath = 'input.txt';
    const gardenMap = readMap(filePath);

    // Calculate the total fencing cost
    const totalCost = calculateFencingCost(gardenMap);

    // Output the result
    console.log("Total fencing cost:", totalCost);
}

// Run the main function
main();
