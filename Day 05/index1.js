const fs = require('fs');

function parseInput(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const [rulesSection, updatesSection] = content.trim().split('\n\n');

    const rules = rulesSection.split('\n').map(line => line.split('|').map(Number));
    const updates = updatesSection.split('\n').map(line => line.split(',').map(Number));

    return { rules, updates };
}

function isUpdateValid(update, rules) {
    for (const [x, y] of rules) {
        if (update.includes(x) && update.includes(y)) {
            if (update.indexOf(x) > update.indexOf(y)) {
                return false;
            }
        }
    }
    return true;
}

function sumMiddlePages(filePath) {
    const { rules, updates } = parseInput(filePath);
    let total = 0;

    for (const pages of updates) {
        if (isUpdateValid(pages, rules)) {
            const middlePage = pages[Math.floor(pages.length / 2)];
            total += middlePage;
        }
    }

    return total;
}

const filePath = 'input.txt';
const result = sumMiddlePages(filePath);
console.log("Sum of middle pages:", result);