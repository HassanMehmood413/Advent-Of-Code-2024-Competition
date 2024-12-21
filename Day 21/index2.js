const fs = require('fs');

const posi = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [null, "0", "A"]
];

const arr_pads = [
    [null, "^", "A"],
    ["<", "v", ">"]
];

function readInput(filePath) {
    return fs.readFileSync(filePath, "utf8");
}

function getPos(arr, code) {
    for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        if (row.includes(code)) {
            return [i, row.indexOf(code)];
        }
    }
}

const shortestCache = new Map();

function shortest(start, end, layers) {
    // Check if the result is cached
    const cacheKey = `${start}-${end}-${layers}`;
    if (shortestCache.has(cacheKey)) {
        return shortestCache.get(cacheKey);
    }

    if (start === "<" && end === ">") {
        return 0;
    }

    if (typeof start === 'string') {
        start = getPos(arr_pads, start);
    }

    if (typeof end === 'string') {
        end = getPos(arr_pads, end);
    }

    if (layers === 0) {
        return 1;
    } else if (layers < 26) {
        let vert = null;
        let hori = null;
        if (end[0] < start[0]) vert = "^";
        else if (end[0] > start[0]) vert = "v";
        if (end[1] < start[1]) hori = "<";
        else if (end[1] > start[1]) hori = ">";

        let result;
        if (!hori && !vert) {
            result = shortest("A", "A", layers - 1);
        } else if (!hori) {
            result = shortest("A", vert, layers - 1) + (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) + shortest(vert, "A", layers - 1);
        } else if (!vert) {
            result = shortest("A", hori, layers - 1) + (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) + shortest(hori, "A", layers - 1);
        } else {
            if (start[1] === 0) {
                result = shortest("A", hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, "A", layers - 1);
            } else if (end[1] === 0) {
                result = shortest("A", vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, "A", layers - 1);
            } else {
                result = Math.min(
                    shortest("A", hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, "A", layers - 1),
                    shortest("A", vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, "A", layers - 1)
                );
            }
        }

        // Cache the result
        shortestCache.set(cacheKey, result);
        return result;
    } else {
        let vert = null;
        let hori = null;
        if (end[0] < start[0]) vert = "^";
        else if (end[0] > start[0]) vert = "v";
        if (end[1] < start[1]) hori = "<";
        else if (end[1] > start[1]) hori = ">";

        let result;
        if (!hori && !vert) {
            result = shortest("A", "A", layers - 1);
        } else if (!hori) {
            result = shortest("A", vert, layers - 1) + (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) + shortest(vert, "A", layers - 1);
        } else if (!vert) {
            result = shortest("A", hori, layers - 1) + (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) + shortest(hori, "A", layers - 1);
        } else {
            if (start[1] === 0 && end[0] === 3) {
                result = shortest("A", hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, "A", layers - 1);
            } else if (end[1] === 0 && start[0] === 3) {
                result = shortest("A", vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, "A", layers - 1);
            } else {
                result = Math.min(
                    shortest("A", hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, "A", layers - 1),
                    shortest("A", vert, layers - 1) +
                    (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) +
                    shortest(vert, hori, layers - 1) +
                    (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) +
                    shortest(hori, "A", layers - 1)
                );
            }
        }

        // Cache the result
        shortestCache.set(cacheKey, result);
        return result;
    }
}

function main() {
    const inputLines = readInput("input.txt").trim().split("\n");
    let score = 0;

    inputLines.forEach(line => {
        const intval = parseInt(line.slice(0, 3), 10);
        let total = 0;

        for (let i = 0; i < line.length - 2; i++) {
            const startp = "A" + line.slice(i, i + 3);
            const endp = line[i];
            total += shortest(getPos(posi, startp), getPos(posi, endp), 26);
        }

        console.log(intval, total);
        score += intval * total;
    });

    console.log(score);
}

main();
