import { readFileSync } from 'fs';

function getData() : string[] {
  try {
    const fileData = readFileSync('2021-03-input', 'utf-8');
    return fileData.split("\n");
  } catch (err) {
    console.error(err);
    return [];
  }
}

function A(): number {
  let sum1: number[] = [];

  const data = getData();
  data.forEach((s) => {
    const digits = s.split('');

    let i = 0;
    while (i < digits.length) {
      if (digits[i] === '1') {
        if (!sum1[i]) sum1[i] = 1; else sum1[i]++;
      }
      i++;
    }
  });

  const dl2 = data.length/2;
  const gammaBinary = sum1.map((n) => n > dl2 ? '1' : '0').join('');
  const epsilonBinary = sum1.map((n) => n > dl2 ? '0' : '1').join('');
  return parseInt(gammaBinary, 2) * parseInt(epsilonBinary, 2);
}


function filterNumbers(data: number[], nbits: number, pos: number, dirMax: boolean): number[] {
  const mask = 1 << (nbits - 1 - pos);

  let n = 0;
  data.forEach((i) => n += (i & mask) !== 0 ? 1 : 0 );

  const compareNum = (n >= data.length/2 ? dirMax : !dirMax) ? mask : 0;
  return data.filter((i) => (i & mask) === compareNum );
}

function B(): number {
  const data = getData();
  const nbits = data[0].length;
  const dataNum = data.map((s) => parseInt(s, 2));

  let dataO2 = [...dataNum];
  for (let i = 0; i < nbits; i++) {
    dataO2 = filterNumbers(dataO2, nbits, i, true);
    if (dataO2.length <= 1) break;
  }
  console.log(dataO2);

  let dataCO2 = [...dataNum];
  for (let i = 0; i < nbits; i++) {
    dataCO2 = filterNumbers(dataCO2, nbits, i, false);
    if (dataCO2.length <= 1) break;
  }
  console.log(dataCO2);

  return dataO2[0] * dataCO2[0];
}

console.log(A());
console.log(B());
