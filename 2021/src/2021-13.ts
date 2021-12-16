import { readFileSync } from 'fs';

type Coord = [number, number];
type Fold = ['x' | 'y', number];
type Sheet = {[id: number]: Coord};

function getData(fileName: string) : [Coord[], Fold[]] {
  try {
    // 6,10
    // fold along y=7
    const fileData = readFileSync(fileName, 'utf-8').split("\n\n");
    return [
      <Coord[]> fileData[0].split("\n").map(s => s.split(',').map(s => parseInt(s))),
      fileData[1].split("\n").map(s => {
        const res = <RegExpMatchArray> s.match(/([xy])=(\d+)/);
        return <Fold> [res[1], parseInt(res[2])];
      })
    ];
  } catch (err) {
    console.error(err);
    return [[],[]];
  }
}

function fold(source: Sheet, f: Fold): Sheet {
  // fold by n: if pos > n, pos = 2n - pos
  const folded = f[0] === 'x' ? 0 : 1;
  const still = 1 - folded;

  console.log(`folding along ${f[0]} at ${f[1]}`);

  let result: Sheet = {};
  for (let key in source) {
    const coords: Coord = [0, 0];
    coords[folded] = source[key][folded] > f[1] ? f[1] * 2 - source[key][folded] : source[key][folded];
    coords[still] = source[key][still];
    // console.log(`point ${source[key][0]}, ${source[key][1]} → ${coords[0]}, ${coords[1]}`);
    
    result[coords[0] * 1000 + coords[1]] = coords;
  }

  return result;
}

function A(fileName: string): number {
  const data = getData(fileName);
  let points: Sheet = {};
  data[0].forEach(d => points[d[0] * 1000 + d[1]] = d);
  
  points = fold(points, data[1][0]);
  return Object.keys(points).length;
}

function B(fileName: string): string {
  const data = getData(fileName);
  let points: Sheet = {};
  let lastx = 0;
  let lasty = 0;

  data[0].forEach(d => points[d[0] * 1000 + d[1]] = d);
  data[1].forEach(f => {
    points = fold(points, f);
    if (f[0] === 'x') lastx = f[1]; else lasty = f[1];
  });

  const image: string[][] = new Array(lasty);
  for (let y = 0; y < image.length; y++) {
    image[y] = new Array(lastx);
    image[y].fill(' ', 0, lastx);
  }

  for (let pid in points) {
    const p = points[pid];
    image[p[1]][p[0]] = '#';
  }

  return image.map(s => s.join('')).join("\n");
}

// console.log(A('2021-13-input-sample'));
console.log(A('2021-13-input'));
// console.log(B('2021-13-input-sample'));
console.log(B('2021-13-input'));
