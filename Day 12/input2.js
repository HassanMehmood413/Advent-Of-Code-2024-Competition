const fs = require('fs');

// Define the ORTHOGONAL_DIRS variable
const ORTHOGONAL_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/**
 * Helper function to safely access the value at position `pos` in the `lines` array.
 * If the position is out of bounds, return the `defaultValue`.
 */
function get(lines, pos, defaultValue) {
    const [x, y] = pos;
    if (x >= 0 && x < lines.length && y >= 0 && y < lines[0].length) {
        return lines[x][y];
    }
    return defaultValue;
}

/**
 * Calculate the total area and perimeter for the grid read from the input file.
 */
function calculateTotalAreaAndPerimeter(inputFile) {
    // Read the input file
    const lines = fs.readFileSync(inputFile, 'utf8').trim().split('\n').map(line => line.split(''));

    let total = 0;
    const visited = new Set();

    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (visited.has(`${i},${j}`)) {
                continue;
            }

            const visitedPerimeter = new Set();
            const stack = [[i, j]];
            let area = 0;
            let perimeter = 0;
            const c = lines[i][j];

            while (stack.length > 0) {
                const [x, y] = stack.pop();
                if (visited.has(`${x},${y}`)) {
                    continue;
                }

                for (const [dx, dy] of ORTHOGONAL_DIRS) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (get(lines, [nx, ny], null) === c) {
                        stack.push([nx, ny]);
                    } else {
                        const edge = `${x},${y},${nx},${ny}`;
                        if (visitedPerimeter.has(edge)) {
                            continue;
                        }

                        perimeter++;
                        visitedPerimeter.add(edge);

                        let curr = [x, y];
                        let ortho = [dy, -dx]; // Rotate 90° clockwise

                        // Follow along the edge in one direction
                        while (true) {
                            curr = [curr[0] + ortho[0], curr[1] + ortho[1]];
                            if (
                                get(lines, curr, null) === c &&
                                get(lines, [curr[0] + dx, curr[1] + dy], null) !== c
                            ) {
                                visitedPerimeter.add(
                                    `${curr[0]},${curr[1]},${curr[0] + dx},${curr[1] + dy}`
                                );
                            } else {
                                break;
                            }
                        }

                        curr = [x, y];
                        ortho = [-dy, dx]; // Rotate 90° counter-clockwise

                        // Follow along the edge in the other direction
                        while (true) {
                            curr = [curr[0] + ortho[0], curr[1] + ortho[1]];
                            if (
                                get(lines, curr, null) === c &&
                                get(lines, [curr[0] + dx, curr[1] + dy], null) !== c
                            ) {
                                visitedPerimeter.add(
                                    `${curr[0]},${curr[1]},${curr[0] + dx},${curr[1] + dy}`
                                );
                            } else {
                                break;
                            }
                        }
                    }
                }

                area++;
                visited.add(`${x},${y}`);
            }

            total += area * perimeter;
        }
    }

    return total;
}

// Example usage:
const inputFile = 'input.txt'; // Specify the path to your input file
const total = calculateTotalAreaAndPerimeter(inputFile);
console.log(total);
