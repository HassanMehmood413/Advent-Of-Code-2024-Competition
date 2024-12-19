const fs = require('fs');

// Function to read input file and parse towel patterns and designs
function readInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

    // Separate towel patterns and desired designs
    const towelPatterns = data[0].split(', ');
    const designs = data.slice(2); // Skip the blank line and get designs

    return { towelPatterns, designs };
}

// Function to check if a design can be formed using towel patterns
function canFormDesign(design, towelPatterns) {
    const queue = [design];
    const seen = new Set();

    while (queue.length > 0) {
        const current = queue.shift();

        if (current === "") return true;

        if (seen.has(current)) continue;
        seen.add(current);

        for (const pattern of towelPatterns) {
            if (current.startsWith(pattern)) {
                queue.push(current.slice(pattern.length));
            }
        }
    }

    return false;
}

// Function to count the number of possible designs
function countPossibleDesigns(filePath) {
    const { towelPatterns, designs } = readInput(filePath);
    let possibleCount = 0;

    for (const design of designs) {
        if (canFormDesign(design, towelPatterns)) {
            possibleCount++;
        }
    }

    return possibleCount;
}

// Input file path
const filePath = "input.txt";

// Count and print the number of possible designs
const result = countPossibleDesigns(filePath);
console.log(`Number of possible designs: ${result}`);
