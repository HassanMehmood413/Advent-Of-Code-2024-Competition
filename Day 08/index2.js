const fs = require('fs');

function findAllAntinodes(filePath) {
    // Step 1: Read the input file and parse the grid
    const grid = fs.readFileSync(filePath, 'utf8').trim().split('\n').map(line => line.trim());

    // Parse grid to collect antenna positions by frequency
    const antennaPositions = {};
    const rows = grid.length;
    const cols = grid[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const char = grid[r][c];
            if (/^[a-zA-Z0-9]$/.test(char)) { // Antennas are letters or digits
                if (!antennaPositions[char]) {
                    antennaPositions[char] = [];
                }
                antennaPositions[char].push([r, c]);
            }
        }
    }

    // Step 2: Find all antinodes for each frequency
    const uniqueAntinodes = new Set();

    for (const freq in antennaPositions) {
        const positions = antennaPositions[freq];
        const n = positions.length;
        if (n < 2) continue; // No antinodes possible with fewer than 2 antennas

        // Add all antenna positions as antinodes
        positions.forEach(([r, c]) => {
            uniqueAntinodes.add(`${r},${c}`);
        });

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const [r1, c1] = positions[i];
                const [r2, c2] = positions[j];

                // Compute direction vector
                const dr = r2 - r1;
                const dc = c2 - c1;

                // Generate all points along the line
                for (let k = -Math.max(rows, cols); k <= Math.max(rows, cols); k++) {
                    const rAntin = r1 + k * dr;
                    const cAntin = c1 + k * dc;

                    // Add valid antinodes within bounds
                    if (rAntin >= 0 && rAntin < rows && cAntin >= 0 && cAntin < cols) {
                        uniqueAntinodes.add(`${rAntin},${cAntin}`);
                    }
                }
            }
        }
    }

    // Step 3: Return the count of unique antinodes
    return uniqueAntinodes.size;
}

// Path to the input file
const filePath = "input.txt";

// Call the function and print the result
const uniqueCount = findAllAntinodes(filePath);
console.log(`Number of unique antinode locations: ${uniqueCount}`);
