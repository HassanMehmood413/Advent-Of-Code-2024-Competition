const fs = require('fs');

// Utility functions
function lines(s) {
    return s.trim().split('\n');
}

// Breadth-First Search (BFS)
function bfs(adj, start) {
    const dist = { [start]: 0 };
    const prev = { [start]: null };
    const q = [start];

    while (q.length > 0) {
        const u = q.shift();
        (adj[u] || []).forEach(v => {
            if (!(v in dist)) {
                dist[v] = dist[u] + 1;
                prev[v] = u;
                q.push(v);
            }
        });
    }

    return [dist, prev];
}

// Topological Sort
function topsort(adj) {
    const indeg = {};
    Object.keys(adj).forEach(u => {
        indeg[u] = 0;
    });

    Object.values(adj).forEach(neighbors => {
        neighbors.forEach(v => {
            indeg[v] = (indeg[v] || 0) + 1;
        });
    });

    const q = [];
    Object.keys(indeg).forEach(u => {
        if (indeg[u] === 0) q.push(u);
    });

    const order = [];
    while (q.length > 0) {
        const u = q.shift();
        order.push(u);
        (adj[u] || []).forEach(v => {
            indeg[v]--;
            if (indeg[v] === 0) q.push(v);
        });
    }

    return [order, order.length !== Object.keys(adj).length];
}

// Read from input.txt
const [A, B] = fs.readFileSync('input.txt', 'utf-8').split('\n\n');

const G = {};
lines(A).forEach(line => {
    const [a, b] = line.split(': ');
    G[a] = parseInt(b, 10);
});

const ops = {};
lines(B).forEach(line => {
    const [x, dest] = line.split(' -> ');
    const [a, op, b] = x.split(' ');
    ops[dest] = { a, op, b };
});

const zs = Object.keys(ops)
    .filter(s => s.startsWith('z'))
    .sort((a, b) => parseInt(b.slice(1)) - parseInt(a.slice(1)));

// Simulate circuit
function sim(G) {
    const n = zs.length;
    let i = 0;

    while (i < n) {
        for (const [d, { a, op, b }] of Object.entries(ops)) {
            if (d in G) continue;
            if (a in G && b in G) {
                const x = G[a];
                const y = G[b];
                if (op === 'AND') G[d] = x & y;
                else if (op === 'OR') G[d] = x | y;
                else if (op === 'XOR') G[d] = x ^ y;
                else throw new Error('Unknown operation');

                if (zs.includes(d)) i++;
            }
        }
    }

    return parseInt(zs.map(z => G[z]).join(''), 2);
}

// Create adjacency list for graph
function mkadj() {
    const adj = {};
    Object.entries(ops).forEach(([s, { a, b }]) => {
        adj[s] = [a, b];
    });
    Object.keys(G).forEach(s => {
        if (!adj[s]) adj[s] = [];
    });
    return adj;
}

// Check for cyclic dependencies
function isCyclic() {
    return topsort(mkadj())[1];
}

// Find swappable nodes
function swappable(s) {
    const [_, prev] = bfs(mkadj(), s);
    return new Set(Object.keys(prev).filter(x => !(x in G)));
}

// Function to simulate tests
function testf(i) {
    const DIFF = 6;
    const tests = [];
    if (i < DIFF) {
        for (let a = 0; a < (1 << i); a++) {
            for (let b = 0; b < (1 << i); b++) {
                tests.push([a, b]);
            }
        }
    } else {
        for (let _ = 0; _ < (1 << (2 * DIFF)); _++) {
            const a = Math.floor(Math.random() * (1 << i));
            const b = Math.floor(Math.random() * (1 << i));
            tests.push([a, b]);
        }
    }
    return tests.sort(() => Math.random() - 0.5);
}

// Recursive function
function f(i, swapped) {
    if (i === 46) {
        console.log('Answer:', Array.from(swapped).sort().join(','));
        return;
    }

    const getv = (s, a, b) => {
        if (s.startsWith('x')) return (a >> parseInt(s.slice(1))) & 1;
        if (s.startsWith('y')) return (b >> parseInt(s.slice(1))) & 1;
        const { a: av, op, b: bv } = ops[s];
        const x = getv(av, a, b);
        const y = getv(bv, a, b);
        if (op === 'AND') return x & y;
        if (op === 'OR') return x | y;
        if (op === 'XOR') return x ^ y;
    };

    const check = () => {
        return testf(i).every(([a, b]) => {
            for (let j = 0; j <= i; j++) {
                const x = getv(`z${j.toString().padStart(2, '0')}`, a, b);
                if (x !== ((a + b) >> j) & 1) return false;
            }
            return true;
        });
    };

    if (check()) {
        f(i + 1, swapped);
        return;
    }

    if (swapped.size === 8) return;

    const inside = Array.from(swappable(`z${i.toString().padStart(2, '0')}`)).filter(x => !swapped.has(x));
    const outside = Object.keys(ops).filter(x => !swapped.has(x));
    const toTest = [...inside.map(x => [x, null]), ...inside.flatMap(x => outside.map(y => [x, y]))];

    for (const [a, b] of toTest) {
        if (b) [ops[a], ops[b]] = [ops[b], ops[a]];
        swapped.add(a);
        if (b) swapped.add(b);

        if (!isCyclic() && check()) f(i, swapped);

        swapped.delete(a);
        if (b) swapped.delete(b);
        if (b) [ops[a], ops[b]] = [ops[b], ops[a]];
    }
}

// Start the search
f(0, new Set());
