const fs = require('fs');

// Load the input file
const connections = fs.readFileSync("input.txt", "utf-8")
    .trim()
    .split("\n")
    .map(line => line.split('-'));

// Build the graph
const graph = {};
connections.forEach(([a, b]) => {
    if (!graph[a]) graph[a] = new Set();
    if (!graph[b]) graph[b] = new Set();
    graph[a].add(b);
    graph[b].add(a);
});

// Find all triads (sets of three interconnected nodes)
function findTriads(graph) {
    const triads = new Set();
    for (const node in graph) {
        const neighbors = Array.from(graph[node]);
        for (let i = 0; i < neighbors.length; i++) {
            for (let j = i + 1; j < neighbors.length; j++) {
                const neighbor1 = neighbors[i];
                const neighbor2 = neighbors[j];
                if (graph[neighbor1] && graph[neighbor1].has(neighbor2)) {
                    const triad = [node, neighbor1, neighbor2].sort().join(',');
                    triads.add(triad);
                }
            }
        }
    }
    return triads;
}

const triads = findTriads(graph);

// Filter triads for those containing a node starting with 't'
const triadsWithT = Array.from(triads).filter(triad =>
    triad.split(',').some(node => node.startsWith('t'))
);

// Output the result
console.log(triadsWithT.length);
