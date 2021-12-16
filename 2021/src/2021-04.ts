import { readFileSync } from 'fs';

function getData() : number[][] {
  try {
    // data example:
    // 92  3 88 13 50
    // 90 70 24 28 52
    // 15 98 10 26  5
    // 84 34 37 73 87
    // 25 36 74 33 63
    //

    const fileData = readFileSync('2021-04-input', 'utf-8');
    // const data: number[][][] = [[]];
    const data: number[][] = [[]];
    fileData.split("\n").forEach((s) => {
      if (s.length > 0)
        // data[data.length-1].push(
        //   s.split(/\s+/).map((a) => +a)
        // );
        data[data.length-1] = [...data[data.length-1], ...s.trim().split(/\s+/).map((a) => +a)];
      else
        data.push([]);
    });

    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

const FSIZE = 5;

type nullNumberArr = (number | null)[];

function printField(f: nullNumberArr, index: number) {
  let s = '';
  for (let i = 0; i < f.length; i++) {
    s += (f[i] !== null ? ((f[i] || 0) < 10 ? ' ' + f[i] : f[i]) : (i === index ? '><' : '--')) + ' ';
    if ((i + 1) % FSIZE === 0) {
      console.log('  ' + s);
      s = '';
    }
  }
}

function checkBingo(field: nullNumberArr, pos: number): boolean {
  // check row
  let rowBingo = true;
  const rowStart = Math.floor(pos / FSIZE) * FSIZE;
  for (let i = rowStart; i < rowStart + FSIZE; i++)
    if (field[i] !== null)
      rowBingo = false;

  // check column
  let colBingo = true;
  let i = pos % FSIZE;
  while (i < FSIZE*FSIZE) {
    if (field[i] !== null)
      colBingo = false;
    i += FSIZE;
  }

  return rowBingo || colBingo;
}

function play(data: nullNumberArr[], n: number): number[] {
  console.log(`### play: ${n}`);
  let result: number[] = [0];
  data.forEach((field, boardNum) => {
    const i = field.findIndex((i) => i === n);
    if (i !== -1) {
      field[i] = null;
      if (checkBingo(field, i)) {
        const fieldSum = field.map((a) => a || 0).reduce((s, a) => s + a, 0);
        // console.log(n, i);
        printField(field, i);
        if (result[0] === 0)
          result = [fieldSum * n, boardNum];
        else
          result.push(boardNum);
      }
    }
  });
  return result;
}

function A(numbers: number[]): number {
  const data: nullNumberArr[] = getData();

  let result: number[] = [0];
  numbers.some((n) => {
    result = play(data, n);
    return result[0] !== 0;
  });

  return result[0];
}

function B(numbers: number[]): number {
  const data: nullNumberArr[] = getData();

  let result: number[] = [0];
  let resScore: number | undefined = 0;
  numbers.some((n) => {
    result = play(data, n);
    resScore = result.shift();
    result.sort((a,b) => a > b ? -1 : 1).forEach((i) => {
      console.log(`Remove board: ${i}`);
      data.splice(i, 1);
      console.log(data.length);
    });
    return data.length <= 1;
  });

  return resScore;
}

const input1 = [
  15,62,2,39,49,25,65,28,84,59,75,24,20,76,60,55,17,7,93,69,32,23,44,81,8,67,41,56,43,89,95,97,61,77,64,37,29,10,79,26,
  51,48,5,86,71,58,78,90,57,82,45,70,11,14,13,50,68,94,99,22,47,12,1,74,18,46,4,6,88,54,83,96,63,66,35,27,36,72,42,98,
  0,52,40,91,33,21,34,85,3,38,31,92,9,87,19,73,30,16,53,80
];

console.log(A(input1));
console.log(B(input1));
