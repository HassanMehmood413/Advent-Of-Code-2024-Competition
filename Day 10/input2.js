const fs = require('fs');

// Reads the topographic map from the input file and converts it into a 2D array of integers
function parseMap(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').trim();
    return data.split('\n').map(line => line.split('').map(Number));
}

// Depth-first search to count distinct hiking trails that begin at (r, c) and end at 9
function dfsCountTrails(topographicMap, r, c) {
    const rows = topographicMap.length;
    const cols = topographicMap[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const stack = [[r, c, [[r, c]]]]; // Stack holds [row, col, currentPath]
    const trails = new Set(); // To track distinct paths ending at 9

    while (stack.length > 0) {
        const [cr, cc, path] = stack.pop();
        const currentHeight = topographicMap[cr][cc];

        // If we reach a height of 9, add the trail
        if (currentHeight === 9) {
            trails.add(JSON.stringify(path));
            continue;
        }

        // Explore neighbors
        for (const [dr, dc] of directions) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                const nextHeight = topographicMap[nr][nc];
                if (nextHeight === currentHeight + 1 && !path.some(([pr, pc]) => pr === nr && pc === nc)) {
                    stack.push([nr, nc, [...path, [nr, nc]]]);
                }
            }
        }
    }

    return trails.size;
}

// Calculates the sum of ratings for all trailheads in the topographic map
function calculateTrailheadRatings(topographicMap) {
    const rows = topographicMap.length;
    const cols = topographicMap[0].length;
    let totalRating = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (topographicMap[r][c] === 0) { // Found a trailhead
                const rating = dfsCountTrails(topographicMap, r, c);
                totalRating += rating;
            }
        }
    }

    return totalRating;
}

// Main function to load the map, compute ratings, and display the result
function main() {
    const filePath = "input.txt"; // Ensure input.txt is in the same directory
    const topographicMap = parseMap(filePath);
    const totalRating = calculateTrailheadRatings(topographicMap);
    console.log(`Total sum of trailhead ratings: ${totalRating}`);
}

// Run the main function
main();
