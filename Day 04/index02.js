const fs = require("fs");
const path = require("path");

// Function to count occurrences of X-MAS patterns
function countXMas(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let totalCount = 0;

    // Check if a given position forms an X-MAS
    function isXMas(r, c) {
        // Ensure the position is within bounds
        if (r - 1 < 0 || r + 1 >= rows || c - 1 < 0 || c + 1 >= cols) {
            return false;
        }

        // Extract characters forming the X
        const tlBr = [grid[r - 1][c - 1], grid[r][c], grid[r + 1][c + 1]].join(""); // Top-left to bottom-right
        const trBl = [grid[r - 1][c + 1], grid[r][c], grid[r + 1][c - 1]].join(""); // Top-right to bottom-left

        // Check all valid "MAS" configurations
        const validMas = new Set(["MAS", "SAM"]);
        return validMas.has(tlBr) && validMas.has(trBl);
    }

    // Iterate through each cell as a potential center
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (isXMas(r, c)) {
                totalCount++;
            }
        }
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
    console.log("Grid Read from File:");
    console.log(grid.join("\n"));

    // Count all occurrences of X-MAS
    const xMasCount = countXMas(grid);

    // Output the result
    console.log(`Total occurrences of 'X-MAS': ${xMasCount}`);
});
