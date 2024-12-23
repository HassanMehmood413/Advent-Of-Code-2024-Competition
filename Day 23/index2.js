const fs = require('fs');

// Read input from the specified file
function readInput(fileName) {
    const data = fs.readFileSync(fileName, 'utf-8');
    return data.trim().split('\n').map(line => line.split('-'));
}

// Bron-Kerbosch algorithm to find maximal cliques
function bronKerbosch(graph, r, p, x, cliques) {
    if (p.size === 0 && x.size === 0) {
        cliques.push(Array.from(r));
        return;
    }
    for (const v of Array.from(p)) {
        bronKerbosch(
            graph,
            new Set([...r, v]),
            new Set([...p].filter(node => graph[v].has(node))),
            new Set([...x].filter(node => graph[v].has(node))),
            cliques
        );
        p.delete(v);
        x.add(v);
    }
}

// Finds all maximal cliques in the graph
function findMaximalCliques(graph) {
    const cliques = [];
    bronKerbosch(graph, new Set(), new Set(Object.keys(graph)), new Set(), cliques);
    return cliques;
}

// Finds the largest clique among all cliques
function findLargestClique(cliques) {
    return cliques.reduce((largest, clique) => (clique.length > largest.length ? clique : largest), []);
}

// Generates the password from the largest clique
function generatePassword(clique) {
    return clique.sort().join(',');
}

// Main function
function main() {
    // Input file name
    const inputFile = 'input.txt';

    // Read input connections
    const connections = readInput(inputFile);

    // Build the adjacency list
    const graph = {};
    connections.forEach(([a, b]) => {
        if (!graph[a]) graph[a] = new Set();
        if (!graph[b]) graph[b] = new Set();
        graph[a].add(b);
        graph[b].add(a);
    });

    // Find all maximal cliques
    const cliques = findMaximalCliques(graph);

    // Find the largest clique
    const largestClique = findLargestClique(cliques);

    // Generate the password
    const password = generatePassword(largestClique);
    console.log(`Password to the LAN party: ${password}`);
}

main();
