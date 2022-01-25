import { readFileSync } from 'fs';

type Vertex = [number, number, number];
type Cube = [Vertex, Vertex];
type Field = (Cube | null)[]
type Step = { val: 0|1, coords: Cube };

function getData(fileName: string): Step[] {
  try {
    // on x=-22..26,y=-27..20,z=-29..19
    // off x=-48..-32,y=26..41,z=-47..-37
    return readFileSync(fileName, 'utf-8').split("\n").map(s => {
      const step: Step = { val: 0, coords: [[0,0,0],[0,0,0]] };
      const m = s.match(/^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/);
      if (!m) return null;

      step.val = m[1] == 'on' ? 1 : 0;
      for(let i = 0; i <= 2; i++) {
        step.coords[0][i] = parseInt(m[i*2+2]);
        step.coords[1][i] = parseInt(m[i*2+3]);
      }

      return step;
    }).filter(s => s !== null) as Step[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

function checkHit(cube: Cube, v: Vertex): boolean {
  return v[0] >= cube[0][0] && v[1] >= cube[0][1] && v[2] >= cube[0][2] &&
         v[0] <= cube[1][0] && v[1] <= cube[1][1] && v[2] <= cube[1][2];
}

function splitCubeBy2(cubes: Cube[], coords: number[], t: 0|1|2, dir: 0|1): Cube[] {
  const [t0, t1] = [[1,2],[0,2],[0,1]][t];

  const out: Cube[] = [];

  for (const cube of cubes) {
    if (
      coords[4] >= cube[0][t] && coords[4] <= cube[1][t]
      && (cube[0][t0] <= coords[2] && cube[1][t0] >= coords[0])
      && (cube[0][t1] <= coords[3] && cube[1][t1] >= coords[1])
    ) {
      const c0: Cube = [[0,0,0],[0,0,0]];
      const c1: Cube = [[0,0,0],[0,0,0]];

      c0[0] = cube[0];
      c0[1][t0] = cube[1][t0];
      c0[1][t1] = cube[1][t1];
      c0[1][t] = coords[4] - dir;

      c1[0][t0] = cube[0][t0];
      c1[0][t1] = cube[0][t1];
      c1[0][t] = coords[4] + 1 - dir;
      c1[1] = cube[1];

      if (c0[1][0] >= c0[0][0] && c0[1][1] >= c0[0][1] && c0[1][2] >= c0[0][2])
        out.push(c0);
      if (c1[1][0] >= c1[0][0] && c1[1][1] >= c1[0][1] && c1[1][2] >= c1[0][2])
        out.push(c1);
    } else
      out.push(cube);
  }
  return out;
}

function intersect2(cubes: Field, i: number, step: Cube) {
  let cube = cubes[i] as Cube;

  let cubeSplit = splitCubeBy2([cube], [step[0][0], step[0][1], step[1][0], step[1][1], step[0][2]], 2, 1);
  cubeSplit = splitCubeBy2(cubeSplit, [step[0][0], step[0][2], step[1][0], step[1][2], step[0][1]], 1, 1);
  cubeSplit = splitCubeBy2(cubeSplit, [step[0][1], step[0][2], step[1][1], step[1][2], step[0][0]], 0, 1);
  cubeSplit = splitCubeBy2(cubeSplit, [step[0][0], step[0][1], step[1][0], step[1][1], step[1][2]], 2, 0);
  cubeSplit = splitCubeBy2(cubeSplit, [step[0][0], step[0][2], step[1][0], step[1][2], step[1][1]], 1, 0);
  cubeSplit = splitCubeBy2(cubeSplit, [step[0][1], step[0][2], step[1][1], step[1][2], step[1][0]], 0, 0);

  if (cubeSplit.length > 1) {
    cubes[i] = null;
    for (const c of cubeSplit)
      if (!checkHit(step, c[0]))
        cubes.push(c);
  } else
    if (checkHit(step, cube[0])) cubes[i] = null;
}

function cubeStep(cubes: Field, step: Step) {
  let nCubes = cubes.length;
  for (let i = 0; i < nCubes; i++)
    intersect2(cubes, i, step.coords);

  if (step.val === 1)
    cubes.push(step.coords);
}

function A(fileName: string): number {
  let steps = getData(fileName);
  let cubes: Field = [];

  for (let i = 0; i < steps.length; i++) {
    // if (steps[i].coords[0][0] < -50 || steps[i].coords[0][0] > 50) continue;
    cubeStep(cubes, steps[i]);
    cubes = cubes.filter(c => c !== null);
  }

  let sum = 0;
  cubes.forEach(c => {
    if (c) {
      const s = (c[1][0] - c[0][0] + 1) * (c[1][1] - c[0][1] + 1) * (c[1][2] - c[0][2] + 1);
      sum += s;
      console.log(c, s);
    }
  });
  return sum;
}


// console.log(A('src/2021-22-input-sample'));
console.log(A('src/2021-22-input'));
