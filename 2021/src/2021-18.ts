import { readFileSync } from 'fs';

class Pair {
  n1: number | Pair = 0;
  n2: number | Pair = 0;
  parent: Pair | null;
  level: number;

  constructor(par: Pair | null) {
    this.parent = par;
    this.level = par ? par.level + 1 : 1;
  }

  parse(s: string): string {
    let rem: string;

    if (s[1].match(/\d/)) {
      this.n1 = parseInt(s[1]);
      rem = s.slice(2); // [#
    } else {
      this.n1 = new Pair(this);
      rem = this.n1.parse(s.slice(1));
    }

    if (rem[1].match(/\d/)) {
      this.n2 = parseInt(rem[1]);
      rem = rem.slice(3); // ,#]
    } else {
      this.n2 = new Pair(this);
      rem = this.n2.parse(rem.slice(1));
      rem = rem.slice(1);  // ]
    }

    return rem;
  }

  setSplit(n: number) {
    this.n1 = Math.floor(n/2);
    this.n2 = n - this.n1;
  }

  setLevel(l: number, p: Pair | null) {
    this.level = l;
    this.parent = p;
    if (typeof this.n1 !== 'number') this.n1.setLevel(l+1, this);
    if (typeof this.n2 !== 'number') this.n2.setLevel(l+1, this);
  }

  assign(n1: Pair | number, n2: Pair | number) {
    this.n1 = n1;
    this.n2 = n2;
    this.setLevel(this.level, null);
  }

  add(p: Pair): Pair {
    const rootP = new Pair(null);
    rootP.assign(this, p);
    return rootP;
  }

  print(): string {
    return `[${typeof this.n1 !== 'number' ? this.n1.print() : this.n1},${typeof this.n2 !== 'number' ? this.n2.print() : this.n2}]`;
  }

  reduce(): number[] {
    const n1n = typeof this.n1 === 'number';
    const n2n = typeof this.n2 === 'number';

    if (n1n && n2n && this.level > 4) {
      // console.log('explode', [this.n1, this.n2]);
      return [this.n1 as number, this.n2 as number];
    }

    if (!n1n) {
      const up = (this.n1 as Pair).reduce();

      if (up.length === 1) return up;
      if (up.length === 2) {
        if (up[1] >= 0) {
          if (up[0] >= 0) this.n1 = 0;
          if (n2n)
            (this.n2 as number) += up[1];
          else
            (this.n2 as Pair).explodeUp1(up[1]);
        }

        if (up[0] >= 0 && this.level > 1) return [up[0], -1];
        return [-1];
      }
    }

    if (!n2n) {
      const up = (this.n2 as Pair).reduce();

      if (up.length === 1) return up;
      if (up.length === 2) {
        if (up[0] >= 0) {
          if (up[1] >= 0) this.n2 = 0;
          if (n1n)
            (this.n1 as number) += up[0];
          else
            (this.n1 as Pair).explodeUp2(up[0]);
        }

        if (up[1] >= 0 && this.level > 1) return [-1, up[1]];
        return [-1];
      }
    }

    return [];
  }

  explodeUp1(n: number) {
    if (typeof this.n1 !== 'number') this.n1.explodeUp1(n); else this.n1 += n;
  }

  explodeUp2(n: number) {
    if (typeof this.n2 !== 'number') this.n2.explodeUp2(n); else this.n2 += n;
  }

  split(): boolean {
    if (typeof this.n1 === 'number') {
      if (this.n1 > 9) {
        // console.log('split', this.n1);
        const p = new Pair(this);
        p.setSplit(this.n1 as number);
        this.n1 = p;
        return true;
      }
    } else {
      if (this.n1.split())
        return true;
    }

    if (typeof this.n2 === 'number') {
      if (this.n2 > 9) {
        // console.log('split', this.n2);
        const p = new Pair(this);
        p.setSplit(this.n2 as number);
        this.n2 = p;
        return true;
      }
    } else {
      if (this.n2.split())
        return true;
    }

    return false;
  }

  reduceAll() {
    while (true) {
      // console.log(this.print());
      if (this.reduce().length > 0) continue;
      if (this.split()) continue;
      break;
    }
  }

  copy(parent: Pair | null = null): Pair {
    const p = new Pair(parent);
    p.n1 = typeof this.n1 === 'number' ? this.n1 : this.n1.copy(p);
    p.n2 = typeof this.n2 === 'number' ? this.n2 : this.n2.copy(p);
    return p;
  }

  magnitude(): number {
    return (typeof this.n1 === 'number' ? this.n1 : this.n1.magnitude()) * 3 + (typeof this.n2 === 'number' ? this.n2 : this.n2.magnitude()) * 2;
  }
}

function getData(fileName: string) : Pair[] {
  try {
    return readFileSync(fileName, 'utf-8').split("\n").map(s => {
      const p = new Pair(null);
      p.parse(s);
      return p;
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

function A(fileName: string): number {
  const result = getData(fileName).reduce((sum, p) => {
    sum = sum.add(p);
    sum.reduceAll();
    // console.log(sum.print());
    return sum;
  });
  console.log("done\n", result.print());

  return result.magnitude();
}

function B(fileName: string): number {
  const pairs = getData(fileName);

  let result = 0;

  for (let i = 0; i < pairs.length; i++)
    for (let j = 0; j < pairs.length; j++)
      if (i !== j) {
        const sum = pairs[i].copy().add(pairs[j].copy());
        sum.reduceAll();
        const sumMagnitude = sum.magnitude();
        if (sumMagnitude > result) result = sumMagnitude;
      }

  return result;
}

// console.log(A('src/2021-18-input-sample'));
// console.log(A('src/2021-18-input'));
// console.log(B('src/2021-18-input-sample'));
console.log(B('src/2021-18-input'));
