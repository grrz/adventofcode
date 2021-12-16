import { readFileSync } from 'fs';

function getData() : number[][] {
  try {
    // 125,645 -> 125,502
    const fileData = readFileSync('2021-05-input', 'utf-8');
    return fileData.split("\n").map((s) => s.split(/,| -> /).map((a) => parseInt(a)));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function calc(type: 'A' | 'B'): number {
  const data = getData();

  const field: number[][] = [];
  let n = 0;

  data.forEach((line) => {
    if (line[0] === line[2]) {
      if (line[1] > line[3]) [line[1], line[3]] = [line[3], line[1]];

      const x = line[0];
      if (!field[x]) field[x] = [];
      for(let y = line[1]; y <= line[3]; y++)
        if (!field[x][y])
          field[x][y] = 1;
        else {
          field[x][y] += 1;
          if (field[x][y] === 2) n += 1;
        }

    } else if (line[1] === line[3]) {
      if (line[0] > line[2]) [line[0], line[2]] = [line[2], line[0]];

      const y = line[1];
      for(let x = line[0]; x <= line[2]; x++) {
        if (!field[x]) field[x] = [];
        if (!field[x][y])
          field[x][y] = 1;
        else {
          field[x][y] += 1;
          if (field[x][y] === 2) n += 1;
        }
      }
    } else if (type === 'B') {
      // diagonal line
      if (line[0] > line[2]) [line[0], line[2], line[1], line[3]] = [line[2], line[0], line[3], line[1]];

      let y = line[1];
      const yDir = line[1] < line[3] ? 1 : -1;
      for(let x = line[0]; x <= line[2]; x++, y += yDir) {
        if (!field[x]) field[x] = [];

        if (!field[x][y])
          field[x][y] = 1;
        else {
          field[x][y] += 1;
          if (field[x][y] === 2) n += 1;
        }
      }
    }
  });

  return n;
}

function A(): number {
  return calc('A');
}

function B(): number {
  return calc('B');
}


console.log(A());
console.log(B());
