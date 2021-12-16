import { readFileSync } from 'fs';

function getData(fileName: string) : number[][] {
  try {
    return readFileSync(fileName, 'utf-8').split("\n").map(r => r.split('').map(s => parseInt(s)));
  } catch (err) {
    console.error(err);
    return [];
  }
}

type Triple = [number, number, number];

function calcPath(field: number[][]): number {
  const maxx = field[0].length - 1;
  const maxy = field.length - 1;

  const fv: number[][] = new Array(maxy+1);
  for (let i = 0; i < fv.length; i++) {
    fv[i] = new Array(maxx+1);
    fv[i].fill(Infinity);
  }
  fv[0][0] = 0;
  
  const queue: Triple[] = [[0,0,0]];

  while (queue.length > 0) {
    const [val, x, y] = <Triple> queue.shift();

    if (val > fv[y][x]) continue;

    if (x > 0 && field[y][x-1] + val < fv[y][x-1]) {
      fv[y][x-1] = field[y][x-1] + val;
      queue.push([fv[y][x-1], x-1, y]);
    }
    if (x < maxx && field[y][x+1] + val < fv[y][x+1]) {
      fv[y][x+1] = field[y][x+1] + val;
      queue.push([fv[y][x+1], x+1, y]);
    }
    if (y > 0 && field[y-1][x] + val < fv[y-1][x]) {
      fv[y-1][x] = field[y-1][x] + val;
      queue.push([fv[y-1][x], x, y-1]);
    }
    if (y < maxy && field[y+1][x] + val < fv[y+1][x]) {
      fv[y+1][x] = field[y+1][x] + val;
      queue.push([fv[y+1][x], x, y+1]);
    }
  }
  
  return fv[maxy][maxx];
}

function A(fileName: string): number {
  const field = getData(fileName);
  return calcPath(field);
}

function increaseF(s: number[]): number[] {
  return s.map(n => n < 9 ? n + 1 : 1);
}

function B(fileName: string): number {
  let field = getData(fileName);

  field = field.map(s1 => {
    const s2 = increaseF(s1);
    const s3 = increaseF(s2);
    const s4 = increaseF(s3);
    const s5 = increaseF(s4);
    return [...s1, ...s2, ...s3, ...s4, ...s5];
  });

  const fY = field.length;
  for (let y = 0; y < fY*4; y++)
    field.push(increaseF(field[y]));

  return calcPath(field);
}

console.log(A('2021-15-input-sample'));
console.log(A('2021-15-input'));
console.log(B('2021-15-input-sample'));
console.log(B('2021-15-input'));
