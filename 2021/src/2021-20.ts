import { readFileSync } from 'fs';

type Field = number[][];

function getData(fileName: string) : [number[], Field] {
  try {
    let algo: number[] = [];
    let image: number[][] = [];

    for (let s of readFileSync(fileName, 'utf-8').split("\n")) {
      if (algo.length === 0) { algo = s.split('').map(c => c === '#' ? 1 : 0); continue; }
      if (s === '') continue;
      image.push(s.split('').map(c => c === '#' ? 1 : 0));
    }
    return [algo, image];
  } catch (err) {
    console.error(err);
    return [[],[]];
  }
}

function largerField(field: Field, plus: number): Field {
  const newField: Field = [];
  const l = field[0].length + plus * 2;

  const newArray: number[] = new Array(l); newArray.fill(0, 0);
  const newSubArray: number[] = new Array(plus); newSubArray.fill(0, 0);
  for (let i = 0; i < plus; i++) newField.push([...newArray]);
  for (let i = 0; i < field.length; i++) newField.push([...newSubArray, ...field[i], ...newSubArray]);
  for (let i = 0; i < plus; i++) newField.push([...newArray]);

  return newField;
}

function step(f1: Field, f2: Field, algo: number[]) {
  const fSizeX = f1[0].length;
  const fSizeY = f1.length;
  for (let y = 1; y < fSizeY-1; y++) {
    if (algo[0] === 1) {
      f2[y][0] = 1 - f1[y][0];
      f2[y][fSizeX - 1] = 1 - f1[y][fSizeX - 1];
    }
    for (let x = 1; x < fSizeX-1; x++) {
      const address = (f1[y-1][x-1]<<8) + (f1[y-1][x]<<7) + (f1[y-1][x+1]<<6) + (f1[y][x-1]<<5) + (f1[y][x]<<4) + (f1[y][x+1]<<3) + (f1[y+1][x-1]<<2) + (f1[y+1][x]<<1) + f1[y+1][x+1];
      f2[y][x] = algo[address];
    }
  }

  if (algo[0] === 1)
    for (let x = 0; x < fSizeX; x++) {
      f2[0][x] = 1 - f1[0][x];
      f2[fSizeY-1][x] = 1 - f1[fSizeY-1][x];
    }
}

function A(fileName: string): number {
  let [algo, field] = getData(fileName);
  const fields: [Field, Field] = [largerField(field, 55), []];
  fields[0].forEach(s => fields[1].push([...s]));

  let fi = 0;
  for (let s = 0; s < 50; s++) {
    step(fields[fi], fields[1-fi], algo);
    fi = 1 - fi;
  }

  let sum = 0;
  for (let row of fields[fi]) row.forEach(v => sum += v);
  return sum;
}


// console.log(A('src/2021-20-input-sample'));
console.log(A('src/2021-20-input'));
