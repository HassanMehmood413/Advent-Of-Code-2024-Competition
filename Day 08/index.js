const fs = require('fs');

function findUniqueAntinodesFromFile(filePath) {
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

    // Step 2: Find antinodes for each frequency
    const uniqueAntinodes = new Set();

    for (const freq in antennaPositions) {
        const positions = antennaPositions[freq];
        const n = positions.length;
        if (n < 2) continue; // No antinodes possible with fewer than 2 antennas

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const [r1, c1] = positions[i];
                const [r2, c2] = positions[j];

                // Compute differences
                const dr = r2 - r1;
                const dc = c2 - c1;

                // First antinode (closer to r1, c1)
                const rAntin1 = r1 - dr;
                const cAntin1 = c1 - dc;

                // Second antinode (further from r2, c2)
                const rAntin2 = r2 + dr;
                const cAntin2 = c2 + dc;

                // Add valid antinodes within bounds
                if (rAntin1 >= 0 && rAntin1 < rows && cAntin1 >= 0 && cAntin1 < cols) {
                    uniqueAntinodes.add(`${rAntin1},${cAntin1}`);
                }
                if (rAntin2 >= 0 && rAntin2 < rows && cAntin2 >= 0 && cAntin2 < cols) {
                    uniqueAntinodes.add(`${rAntin2},${cAntin2}`);
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
const uniqueCount = findUniqueAntinodesFromFile(filePath);
console.log(`Number of unique antinode locations: ${uniqueCount}`);
