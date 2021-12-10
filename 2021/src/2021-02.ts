import { readFileSync } from 'fs';

function getData() : string[][] {
  try {
    const fileData = readFileSync('2021-02-input', 'utf-8');
    return fileData.split("\n").map((s: string) => s.split(' '));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function A(): number {
  let h = 0;
  let v = 0;

  getData().forEach((a) => {
    switch(a[0]) {
      case 'forward':
        h += parseInt(a[1]);
        break;
      case 'up':
        v -= parseInt(a[1]);
        break;
      case 'down':
        v += parseInt(a[1]);
        break;
    }
  });

  return h*v;
}

function B(): number {
  let h = 0;
  let v = 0;
  let aim = 0;

  getData().forEach((a) => {
    switch(a[0]) {
      case 'forward':
        h += parseInt(a[1]);
        v += aim * parseInt(a[1]);
        break;
      case 'up':
        aim -= parseInt(a[1]);
        break;
      case 'down':
        aim += parseInt(a[1]);
        break;
    }
  });

  return h*v;
}

console.log(A());
console.log(B());
