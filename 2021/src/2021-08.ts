import { readFileSync } from 'fs';

function getData(fileName: string) : string[][][] {
  try {
    // cdf bcfg fc cegfda adfbcg dbfag cbdea dbacgfe gbafde adcbf | cf bafcdg cf afgdb
    const fileData = readFileSync(fileName, 'utf-8');
    return fileData.split("\n").map((s) => {
      const ss = s.split(' | ');
      const examples = ss[0].split(' ').map((a: string) => a.split('').sort().join('') );
      const data = ss[1].split(' ').map((a: string) => a.split('').sort().join('') );
      return [examples, data];
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

function A(fileName: string): number {
  const data = getData(fileName);
  let n = 0;

  data.forEach((str) => str[1].forEach((d) => {
    const dl = d.length;
    if (dl === 2 || dl === 7 || dl === 3 || dl === 4) n += 1;
  }));

  return n;
}

function digitIn(d1: string, d2: string): boolean {
  const d1a = d1.split('');
  return d1a.filter(a => d2.includes(a)).length === d2.length;
}

function digitDiff(d1: string, d2: string): number {
  const d2a = d2.split('');
  return d2a.filter(a => !d1.includes(a)).length;
}

function findDigits(str: string[]): { [id: string]: string } {
  const digits: string[] = [];
  const is235: string[] = [];
  const is069: string[] = [];

  str.forEach((d) => {
    const dl = d.length;
    switch (dl) {
     case 2: digits[1] = d; break;
     case 4: digits[4] = d; break;
     case 3: digits[7] = d; break;
     case 7: digits[8] = d; break;
     case 6: is069.push(d); break;
     case 5: is235.push(d); break;
    }
  });

  // 9 ← all from 4
  is069.forEach((d, i) => {
    if (digitIn(d, digits[4])) {
      digits[9] = d;
      is069.splice(i, 1);
    }
  });

  // 0 ← !9 & all from 1
  is069.forEach((d, i) => {
    if (digitIn(d, digits[1])) {
      digits[0] = d;
      is069.splice(i, 1);
    }
  });

  // 6 ← !0 & !9
  digits[6] = is069[0];
  

  // 3 ← all from 1
  is235.forEach((d, i) => {
    if (digitIn(d, digits[1])) {
      digits[3] = d;
      is235.splice(i, 1);
    }
  });

  // 5 ← !3 & (9 - 1 segment)
  is235.forEach((d, i) => {
    if (digitDiff(d, digits[9]) === 1) {
      digits[5] = d;
      is235.splice(i, 1);
    }
  });

  // 2 ← !3 & !5
  digits[2] = is235[0];

  const res: { [id: string]: string } = {};
  digits.forEach((v, i) => res[v] = i.toString());
  return res;
}

function B(fileName: string): number {
  const data = getData(fileName);

  return data.reduce((sum, str) => {
    const digits = findDigits(str[0]);
    const d = str[1].map((d) => digits[d]).join('');
    console.log(d);
    return sum + parseInt(d);
  }, 0);
}

// console.log(A('2021-08-input-sample'));
console.log(A('2021-08-input'));
// console.log(B('2021-08-input-sample'));
console.log(B('2021-08-input'));
