const fs = require("fs");
const path = require("path");

// Function to count occurrences of "XMAS" in the grid
function countXmasInGrid(grid) {
    const rows = grid.length;
    const cols = grid[0] ? grid[0].length : 0;
    const target = "XMAS";
    const targetLen = target.length;
    let totalCount = 0;

    // Helper function to count occurrences in a line
    function countInLine(line) {
        let count = 0;
        for (let i = 0; i <= line.length - targetLen; i++) {
            if (line.slice(i, i + targetLen) === target) {
                count++;
            }
        }
        return count;
    }

    // Count horizontally and reverse horizontally
    for (let row of grid) {
        totalCount += countInLine(row);
        totalCount += countInLine(row.split('').reverse().join(''));
    }

    // Count vertically and reverse vertically
    for (let col = 0; col < cols; col++) {
        let column = '';
        for (let row = 0; row < rows; row++) {
            column += grid[row][col];
        }
        totalCount += countInLine(column);
        totalCount += countInLine(column.split('').reverse().join(''));
    }

    // Count diagonals (top-left to bottom-right and their reverses)
    for (let start = -rows + 1; start < cols; start++) {
        let diagonal = '';
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (col - row === start) {
                    diagonal += grid[row][col];
                }
            }
        }
        totalCount += countInLine(diagonal);
        totalCount += countInLine(diagonal.split('').reverse().join(''));
    }

    // Count anti-diagonals (top-right to bottom-left and their reverses)
    for (let start = 0; start < rows + cols - 1; start++) {
        let antiDiagonal = '';
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (row + col === start) {
                    antiDiagonal += grid[row][col];
                }
            }
        }
        totalCount += countInLine(antiDiagonal);
        totalCount += countInLine(antiDiagonal.split('').reverse().join(''));
    }

    return totalCount;
}

// File path to the input file
const filePath = path.join(__dirname, "input.txt");

// Read the grid from the file
fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
        console.error("Error reading the file:", err.message);
        return;
    }

    // Convert file content into a grid array
    const grid = data.trim().split("\n");

    // Debug: Print the grid to confirm it is read correctly

    // Count all occurrences of "XMAS"
    const xmasCount = countXmasInGrid(grid);

    // Output the result
    console.log(`Total occurrences of 'XMAS': ${xmasCount}`);
});
