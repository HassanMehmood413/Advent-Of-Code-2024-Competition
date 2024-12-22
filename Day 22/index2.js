const fs = require('fs');

// Generate the next secret number
function generateNextSecret(secretNumber) {
    secretNumber ^= (secretNumber * 64) % 16777216;
    secretNumber %= 16777216;
    secretNumber ^= Math.floor(secretNumber / 32) % 16777216;
    secretNumber %= 16777216;
    secretNumber ^= (secretNumber * 2048) % 16777216;
    secretNumber %= 16777216;
    return secretNumber;
}

// Generate the sequence of prices
function getPriceSequence(initialSecret) {
    const prices = [];
    let secret = initialSecret;
    for (let i = 0; i <= 2000; i++) { // We need 2001 to get 2000 changes
        prices.push(secret % 10);
        secret = generateNextSecret(secret);
    }
    return prices;
}

// Find the sequences of changes in prices
function findSequences(prices) {
    const sequences = {};
    const changes = [];

    // Calculate all changes
    for (let i = 1; i < prices.length; i++) {
        changes.push(prices[i] - prices[i - 1]);
    }

    // Record the 4-change sequence starting at each position
    for (let i = 0; i < changes.length - 3; i++) {
        const seq = changes.slice(i, i + 4).join(','); // Convert array to string for use as key
        if (!sequences[seq]) { // Only keep the first occurrence
            sequences[seq] = prices[i + 4];
        }
    }

    return sequences;
}

// Main function
function main() {
    const filePath = "input.txt";
    const initialSecrets = fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(Number);

    // Pre-calculate all sequences for each buyer
    const buyerSequences = initialSecrets.map(secret => {
        const prices = getPriceSequence(secret);
        return findSequences(prices);
    });

    // Find the sequence that appears in most buyers with the highest total
    let bestTotal = 0;
    let bestSequence = null;

    // Get all unique sequences
    const allSequences = new Set();
    buyerSequences.forEach(sequences => {
        Object.keys(sequences).forEach(seq => allSequences.add(seq));
    });

    // Check each sequence
    allSequences.forEach(seq => {
        const total = buyerSequences.reduce((sum, sequences) => sum + (sequences[seq] || 0), 0);
        if (total > bestTotal) {
            bestTotal = total;
            bestSequence = seq;
        }
    });

    console.log(`Best sequence: [${bestSequence.split(',').map(Number).join(', ')}]`);
    console.log(`Maximum bananas: ${bestTotal}`);
}

main();
