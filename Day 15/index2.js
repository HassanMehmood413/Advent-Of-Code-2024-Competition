const fs = require('fs');

// Read input from 'input.txt'
const inp = fs.readFileSync('input.txt', 'utf-8');

// Split the input into grid and directions
const parts = inp.split("\n\n");
let lines = parts[0].split("\n");

// Function to expand grid tiles
function expand(c) {
    if (c === "O") {
        return "[]";
    } else if (c === "@") {
        return "@.";
    } else {
        return c + c;
    }
}

// Expanding the grid
lines = lines.map(line => line.split('').map(expand).join(''));
console.log(lines.join("\n"));

// Dimensions of the expanded grid
const m = lines.length;
const n = lines[0].length;

// Create a grid (using a simple object for defaultdict)
const grid = {};
for (let i = 0; i < m; i++) {
    grid[i] = {};
    for (let j = 0; j < n; j++) {
        grid[i][j] = lines[i][j];
    }
}

// Directions corresponding to <, >, ^, v
const dirs = [[0, 1], [0, -1], [-1, 0], [1, 0]];
const chardirs = {"<": 1, ">": 0, "^": 2, "v": 3};

// Function to check if a move is valid
function checkMove(d, i, j, alreadyChecked) {
    const pos = `${i},${j}`;
    if (alreadyChecked[pos]) {
        return alreadyChecked[pos];
    }
    alreadyChecked[pos] = true;

    if (grid[i][j] === "#") {
        alreadyChecked[pos] = false;
    } else if (grid[i][j] === ".") {
        alreadyChecked[pos] = true;
    } else if (grid[i][j] === "@") {
        alreadyChecked[pos] = checkMove(d, i + d[0], j + d[1], alreadyChecked);
    } else if (grid[i][j] === "[") {
        alreadyChecked[pos] = checkMove(d, i + d[0], j + d[1], alreadyChecked) && checkMove(d, i, j + 1, alreadyChecked);
    } else if (grid[i][j] === "]") {
        alreadyChecked[pos] = checkMove(d, i + d[0], j + d[1], alreadyChecked) && checkMove(d, i, j - 1, alreadyChecked);
    }
    return alreadyChecked[pos];
}

// Function to commit the move
function commitMove(d, i, j, alreadyCommitted) {
    const pos = `${i},${j}`;
    if (alreadyCommitted.has(pos)) {
        return;
    }
    alreadyCommitted.add(pos);

    if (grid[i][j] === "#") {
        return;
    } else if (grid[i][j] === ".") {
        return;
    } else if (grid[i][j] === "[") {
        commitMove(d, i + d[0], j + d[1], alreadyCommitted);
        commitMove(d, i, j + 1, alreadyCommitted);
        grid[i + d[0]][j + d[1]] = grid[i][j];
        grid[i][j] = ".";
    } else if (grid[i][j] === "]") {
        commitMove(d, i + d[0], j + d[1], alreadyCommitted);
        commitMove(d, i, j - 1, alreadyCommitted);
        grid[i + d[0]][j + d[1]] = grid[i][j];
        grid[i][j] = ".";
    } else if (grid[i][j] === "@") {
        commitMove(d, i + d[0], j + d[1], alreadyCommitted);
        grid[i + d[0]][j + d[1]] = grid[i][j];
        grid[i][j] = ".";
    }
}

// Find initial robot position
let robotPos = [0, 0];
for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
        if (grid[i][j] === "@") {
            robotPos = [i, j];
        }
    }
}

// Directions to move (from input)
for (const dirchar of parts[1]) {
    if (dirchar === "\n") {
        continue;
    }
    const d = dirs[chardirs[dirchar]];  // Get the direction tuple
    const [i, j] = robotPos;
    if (checkMove(d, i, j, {})) {
        commitMove(d, i, j, new Set());  // Commit the move
        robotPos = [robotPos[0] + d[0], robotPos[1] + d[1]];  // Update robot position
    }
}

// Calculate GPS sum for boxes
let result = 0;
for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
        if (grid[i][j] === "[") {
            // Calculate the GPS coordinate for the box
            result += 100 * i + j;
        }
    }
}

// Print the final result
console.log("Final GPS sum:", result);
