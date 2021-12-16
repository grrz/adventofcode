import { readFileSync } from 'fs';

function getData(fileName: string) : number[][] {
  try {
    const fileData = readFileSync(fileName, 'utf-8').split("\n").map(s => s.split('').map(d => parseInt(d)));

    fileData.forEach(r => { r.unshift(10); r.push(10); });
    const edge = new Array(fileData[0].length);
    edge.fill(10, 0, edge.length);
    fileData.unshift(edge);
    fileData.push(edge);

    return fileData;

  } catch (err) {
    console.error(err);
    return [];
  }
}

function A(fileName: string): number {
  const field = getData(fileName);

  let sum = 0;

  for (let y = 1; y < field.length - 1; y++) {
    const row = field[y];
    for (let x = 1; x < row.length - 1; x++) {
      const v = row[x];
      if (v < field[y-1][x] && v < field[y+1][x] && v < row[x-1] && v < row[x+1])
        sum += v + 1;
    }
  }

  return sum;
}

function measureBasin(field: number[][], lowx: number, lowy: number): number {
  const basinData: { [id: number]: number } = {};
  const queue: [number, number][] = [[lowx, lowy]];

  while (queue.length > 0) {
    let [x, y] = <[number, number]> queue.pop();

    if (field[y][x] >= 9) continue;
    if (basinData[y * 1000 + x]) continue;
  
    // console.log(x, y, field[y][x]);
    basinData[y * 1000 + x] = 1;
  
    queue.push([x+1, y]);
    queue.push([x-1, y]);
    queue.push([x, y+1]);
    queue.push([x, y-1]);  
  }


  let n = 0; for (let key in basinData) n++;
  return n;
}

function B(fileName: string): number {
  const field = getData(fileName);

  let basins: number[] = [];

  for (let y = 1; y < field.length - 1; y++) {
    const row = field[y];
    for (let x = 1; x < row.length - 1; x++) {
      const v = row[x];
      if (v < field[y-1][x] && v < field[y+1][x] && v < row[x-1] && v < row[x+1])
        basins.push(measureBasin(field, x, y));
    }
  }

  basins.sort((a, b) => a < b ? 1 : -1);
  console.log(basins);

  return basins[0] * basins[1] * basins[2];
}


// console.log(A('2021-09-input-sample'));
console.log(A('2021-09-input'));
// console.log(B('2021-09-input-sample'));
console.log(B('2021-09-input'));
