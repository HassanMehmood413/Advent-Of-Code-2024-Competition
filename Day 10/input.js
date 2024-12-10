const fs = require('fs');

// Read the input file and convert it to a 2D list of integers
function readInput(filename) {
    const data = fs.readFileSync(filename, 'utf8').trim();
    return data.split('\n').map(line => line.split('').map(Number));
}

// Depth-first search to find all 9-height positions reachable from a trailhead
function findTrailToNine(grid, start) {
    const rows = grid.length;
    const cols = grid[0].length;
    const ninePositions = [];

    function dfs(x, y, currentHeight, path) {
        // If we've reached height 9, this is a valid trail
        if (grid[x][y] === 9) {
            ninePositions.push([x, y]);
            return;
        }

        // Possible moves: up, down, left, right
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            // Check if the new cell is within bounds and a valid next step
            if (
                nx >= 0 && nx < rows &&
                ny >= 0 && ny < cols &&
                !path.has(`${nx},${ny}`) &&
                grid[nx][ny] === currentHeight + 1
            ) {
                // Create a new path including this step
                const newPath = new Set(path);
                newPath.add(`${nx},${ny}`);
                // Continue the trail
                dfs(nx, ny, grid[nx][ny], newPath);
            }
        }
    }

    // Start the search from the trailhead
    dfs(start[0], start[1], grid[start[0]][start[1]], new Set([`${start[0]},${start[1]}`]));

    return ninePositions;
}

// Find all trailheads and calculate their scores
function solveTrailheads(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const trailheadScores = [];

    // Find all trailheads (positions with height 0)
    const trailheads = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 0) {
                trailheads.push([r, c]);
            }
        }
    }

    // Calculate score for each trailhead
    for (const trailhead of trailheads) {
        // Find unique 9-height positions reachable from this trailhead
        const reachableNines = new Set(
            findTrailToNine(grid, trailhead).map(pos => `${pos[0]},${pos[1]}`)
        );
        trailheadScores.push(reachableNines.size);
    }

    // Verbose output for debugging
    console.log("Trailhead Scores:", trailheadScores);

    return trailheadScores.reduce((sum, score) => sum + score, 0);
}

// Main function
function main() {
    // Read input from file
    const grid = readInput('input.txt');

    // Solve and print the total trailhead score
    const totalScore = solveTrailheads(grid);
    console.log(`Sum of trailhead scores: ${totalScore}`);
}

// Run the main function
main();
