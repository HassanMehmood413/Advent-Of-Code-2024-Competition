const fs = require('fs');

// Function to read input file and parse towel patterns and designs
function readInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

    // Separate towel patterns and desired designs
    const towelPatterns = data[0].split(', ');
    const designs = data.slice(2); // Skip the blank line and get designs

    return { towelPatterns, designs };
}

// Function to count all ways to create a design using towel patterns
function countWaysToFormDesign(design, towelPatterns) {
    const memo = {};

    function dfs(remaining) {
        if (remaining === "") return 1;

        if (remaining in memo) return memo[remaining];

        let ways = 0;

        for (const pattern of towelPatterns) {
            if (remaining.startsWith(pattern)) {
                ways += dfs(remaining.slice(pattern.length));
            }
        }

        memo[remaining] = ways;
        return ways;
    }

    return dfs(design);
}

// Function to calculate total number of ways to form all designs
function totalWaysToFormDesigns(filePath) {
    const { towelPatterns, designs } = readInput(filePath);
    let totalWays = 0;

    for (const design of designs) {
        totalWays += countWaysToFormDesign(design, towelPatterns);
    }

    return totalWays;
}

// Input file path
const filePath = "input.txt";

// Count and print the total number of ways to form all designs
const result = totalWaysToFormDesigns(filePath);
console.log(`Total number of ways to form all designs: ${result}`);
