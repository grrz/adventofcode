import { readFileSync } from 'fs';

type Field = number[][];
const fMap: {[index: string]: number} = { '.': 0, '>': 1, 'v': 2 };
const fMapRev: string[] = [ '.', '>', 'v', '×' ];

function getData(fileName: string): Field {
  try {
    // v...>>.vv>
    return readFileSync(fileName, 'utf-8').split("\n").map(s =>
      s.split('').map(d => fMap[d])
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

function printField(f: Field) {
  for (const row of f)
    console.log(row.map(c => fMapRev[c]).join(''));
}

function stepField(f1: Field, f2: Field, f3: Field): number {
  for (const row of f2) row.fill(0,0);
  for (const row of f3) row.fill(0,0);

  let moves = 0;
  const maxY = f1.length - 1;
  for (let y = 0; y <= maxY; y++) {
    const maxX = f1[y].length - 1;
    for (let x = 0; x <= maxX; x++) {
      if (f1[y][x] === 1) {
        const newx = x < maxX ? x + 1 : 0;
        if (f1[y][newx] === 0) {
          f3[y][newx] = 1;
          moves++;
        } else
          f3[y][x] = 1;
      } else
        f3[y][x] += f1[y][x];
    }
  }

  for (let y = 0; y <= maxY; y++) {
    const maxX = f3[y].length - 1;
    const newy = y < maxY ? y + 1 : 0;
    for (let x = 0; x <= maxX; x++) {
      if (f3[y][x] === 2) {
        if (f3[newy][x] === 0) {
          f2[y][x] = 0;
          f2[newy][x] = 2;
          moves++;
        } else
          f2[y][x] = 2;
      } else
        f2[y][x] += f3[y][x];
    }
  }

  return moves;
}

function A(fileName: string): number {
  const f: [Field, Field, Field] = [getData(fileName), [], []];
  for (let i = 0; i < f[0].length; i++) {
    f[1][i] = new Array(f[0][i].length);
    f[2][i] = new Array(f[0][i].length);
  }

  let currentField = 0;
  let n = 1;
  while (true) {
    // printField(f[currentField]);
    // console.log(n);
    if (stepField(f[currentField], f[1-currentField], f[2]) === 0)
      break;
    n++;
    currentField = 1-currentField;
  }

  return n;
}

// console.log(A('src/2021-25-input-sample'));
console.log(A('src/2021-25-input'));
