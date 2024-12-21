const fs = require('fs');

let inputval = "";
const posi = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
];
const arr_pads = [
  [null, "^", "A"],
  ["<", "v", ">"]
];

const memo = new Map();

function readInput(filePath) {
  return fs.readFileSync(filePath, 'utf-8').split("\n");
}

function getPos(arr, code) {
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i];
    const index = row.indexOf(code);
    if (index !== -1) {
      return [i, index];
    }
  }
  return null;
}

function shortest(start, end, layers) {
  const memoKey = `${start}-${end}-${layers}`;
  if (memo.has(memoKey)) {
    return memo.get(memoKey);
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
  } else if (layers < 3) {
    let vert = null;
    let hori = null;
    if (end[0] < start[0]) {
      vert = "^";
    } else if (end[0] > start[0]) {
      vert = "v";
    }
    if (end[1] < start[1]) {
      hori = "<";
    } else if (end[1] > start[1]) {
      hori = ">";
    }

    if (!hori && !vert) {
      return shortest("A", "A", layers - 1);
    } else if (!hori) {
      return shortest("A", vert, layers - 1) + (Math.abs(end[0] - start[0]) - 1) * shortest(vert, vert, layers - 1) + shortest(vert, "A", layers - 1);
    } else if (!vert) {
      return shortest("A", hori, layers - 1) + (Math.abs(end[1] - start[1]) - 1) * shortest(hori, hori, layers - 1) + shortest(hori, "A", layers - 1);
    } else {
      let result;
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
      memo.set(memoKey, result);
      return result;
    }
  }
}

function main() {
  inputval = readInput("input.txt");
  let score = 0;
  for (let line of inputval) {
    const intval = parseInt(line.slice(0, 3));
    let total = 0;
    for (let i = 0; i < line.length - 1; i++) {
      const startp = "A" + line.slice(0, 3)[i];
      const endp = line[i + 1];
      total += shortest(getPos(posi, startp), getPos(posi, endp), 3);
    }
    console.log(intval, total);
    score += intval * total;
  }
  console.log(score);
}

main();
