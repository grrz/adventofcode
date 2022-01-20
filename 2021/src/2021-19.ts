import { readFileSync } from 'fs';

type Coords = [number, number, number];
type Set = Coords[];
type FSet = number[];

const matchThreshold = 8;

function getData(fileName: string) : Set[] {
  try {
    // --- scanner 0 ---
    // 553,-930,633
    // 22,-14,-82
    const data: Set[] = [];
    let set: Set;
    readFileSync(fileName, 'utf-8').split("\n").forEach(s => {
      if (s.match('^---')) {
        set = [];
        data.push(set);
        return;
      }

      const p = s.split(',');
      if (p.length === 3)
        set.push(s.split(',').map(ss => parseInt(ss)) as Coords);
    });

    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// -x+y → +y+x   +x+y → +y-x
// -x-y → -y+x   +x-y → -y-x
const rsHelper = [[1, 2], [0, 2], [0, 1]];
function rotateSet(set: Set, r: number): Set {
  const [a1, a2] = rsHelper[r];

  return set.map(b => {
    const nb: Coords = [0,0,0];
    nb[r] = b[r];
    nb[a1] = (b[a2] > 0 ? 1 : -1) * Math.abs(b[a2]);
    nb[a2] = (b[a1] < 0 ? 1 : -1) * Math.abs(b[a1]);
    return nb;
  });
}

const flatten_step = 100_000;
function flattenSet(set: Set): FSet {
  return set.map(c => c[0] + c[1] * flatten_step + c[2] * flatten_step * flatten_step);
}

function unflattenSet(set: FSet): Set {
  return set.map(c => {
    const z = Math.round(c / (flatten_step * flatten_step));
    const zs = z * flatten_step * flatten_step;
    const y = Math.round((c - zs) / flatten_step);
    return [c - y * flatten_step - zs, y, z]
  });
}

class FSetGetter {
  set: Set;
  setB: Set;
  steps = [2, 0, 2, 0, 2];
  step: number;
  stepB: number;

  constructor(set: Set) {
    this.set = set;
    this.setB = set;
    this.step = 0;
    this.stepB = 0;
  }

  next(): FSet | null {
    if (this.stepB < 4) {
      // rotate current pos around Y
      if (this.stepB > 0)
        this.setB = rotateSet(this.setB, 1);
      this.stepB++;
      return flattenSet(this.setB);
    }

    // next pos
    if (this.step < this.steps.length) {
      this.set = rotateSet(this.set, this.steps[this.step]);
      this.step++;
      this.setB = this.set;
      this.stepB = 1;
      return flattenSet(this.setB);
    }

    return null;
  }

}

function _makeOffSet(set: FSet, offsetP: number, fieldOffset: number): FSet {
  const nval = set[offsetP];
  return set.map(c => c - nval + fieldOffset);
}

// returns offset if two sets match at matchThreshold+ points
function findMatch(field: FSet, set: Set): [FSet | null, number] {
  const setAL = field.length;
  const setBL = set.length;

  const fSets = new FSetGetter(set);

  let nextSet = fSets.next();
  while (nextSet) {
    for (let i1 = 0; i1 < setAL; i1++) {
      for (let i2 = 0; i2 < setBL; i2++) {
        const s2 = _makeOffSet(nextSet, i2, field[i1]);

        const match = s2.filter(function(c) {
          return field.indexOf(c) >= 0;
        }).length;

        if (match >= matchThreshold)
          return [s2, field[i1] - nextSet[i2]];
      }
    }

    nextSet = fSets.next();
  }

  return [null, 0];
}

const scanners: number[] = [0];

function makeField(sets: Set[]): FSet {
  let field: FSet = flattenSet(sets.pop() as Set);

  while (sets.length) {
    console.log(`sets: ${sets.length}`);

    // match field against other sets
    for (let i = 0; i < sets.length; i++) {
      const [match, offset] = findMatch(field, sets[i]);
      if (match) {
        field = field.concat(match);
        field = field.filter((item, pos) => field.indexOf(item) === pos);
        sets.splice(i, 1);
        scanners.push(offset);
        break;
      }
    }
  }

  return field;
}

function manhattan(a: Coords, b: Coords): number {
  return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]);
}

function A(fileName: string): number {
  return makeField(getData(fileName)).length;
}

function B(fileName: string): number {
  console.log(makeField(getData(fileName)).length);
  const volScanners = unflattenSet(scanners);
  const sl = volScanners.length;
  let max = 0;
  for (let a = 0; a < sl - 1; a++)
    for (let b = a + 1; b < sl; b++) {
      const m = manhattan(volScanners[a], volScanners[b]);
      if (max < m) max = m;
    }

  return max;
}

// console.log(A('src/2021-19-input-sample'));
// console.log(A('src/2021-19-input'));
// console.log(B('src/2021-19-input-sample'));
console.log(B('src/2021-19-input'));
