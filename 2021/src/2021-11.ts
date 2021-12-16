const input11 = [
  7147713556,
  6167733555,
  5183482118,
  3885424521,
  7533644611,
  3877764863,
  7636874333,
  8687188533,
  7467115265,
  1626573134
];

const input11_test = [
  5483143223,
  2745854711,
  5264556173,
  6141336146,
  6357385478,
  4167524645,
  2176841721,
  6882881134,
  4846848554,
  5283751526
];

function flash(o: number[][], ox: number, oy: number) {
  const queue: [number, number][] = [[ox, oy]];

  while (queue.length > 0) {
    const [x, y] = <[number, number]> queue.pop();
    if (x < 0 || y < 0 || y >= o.length || x >= o[y].length) continue;
    o[y][x]++;
    
    if (o[y][x] < 10 || o[y][x] > 100) continue; // if >100, then it is already registered as flashed
    o[y][x] += 100; // make sure it won't be counted again

    queue.push([x-1, y-1]);
    queue.push([x-1, y  ]);
    queue.push([x-1, y+1]);
    queue.push([x,   y-1]);  
    queue.push([x,   y+1]);
    queue.push([x+1, y-1]);
    queue.push([x+1, y  ]);
    queue.push([x+1, y+1]);  
  }

}

function step(o: number[][]) {
  // increase energy
  for (let y = 0; y < o.length; y++) {
    const row = o[y];
    for (let x = 0; x < row.length; x++)
      row[x]++;
  }

  // make flashes
  for (let y = 0; y < o.length; y++) {
    const row = o[y];
    for (let x = 0; x < row.length; x++)
      if (row[x] >= 10 && o[y][x] < 100) { // if >100, then it is already registered as flashed
        row[x]--; // it will be increased again in flash()
        flash(o, x, y);
      }
  }

  // drop energy and count flashes
  let flashes = 0;
  for (let y = 0; y < o.length; y++) {
    const row = o[y];
    for (let x = 0; x < row.length; x++)
      if (row[x] > 9) {
        row[x] = 0;
        flashes++;
      }
  }

  return flashes;
}

function A(input: number[]) {
  const octopuses = input.map(n => n.toString().split('').map(s => parseInt(s)));

  let flashes = 0;
  for (let i = 0; i < 100; i++) {
    const n = step(octopuses);
    flashes += n;
    console.log(`${i}: ${n}`);
    // console.log(octopuses.map(r => r.join('')));
  }

  return flashes;
}

function B(input: number[]) {
  const octopuses = input.map(n => n.toString().split('').map(s => parseInt(s)));

  let i = 0;
  let flashes = 0;
  while (flashes !== 100 && i < 1000) {
    i++;
    flashes = step(octopuses);
    console.log(`${i}: ${flashes}`);
  }

  return i;
}

// console.log(A(input11_test));
// console.log(A(input11));
// console.log(B(input11_test));
console.log(B(input11));
