type Dock = 0 | 10 | 20 | 30 | 40
type ChipFace = 1 | 2 | 3 | 4

type Chip = {
  face: ChipFace,
  dock: Dock,
  position: number
// #############
// #12.3.4.5.67#
// ###.#.#.#.###
// 1.1-1.4, 2.2-2.4, ...
}

type Desk = (ChipFace | null)[];
type ChipMove = { chip: Chip, to: number, l: number };

type Step = {
  desk: Desk,
  moves: ChipMove[],
  move: string,
  energy: number
};

const chipEnergy = { 1: 1, 2: 10, 3: 100, 4: 1000 }

const checkDockLaneData: { [index: number]: number[][] } = {
  10: [[1,2], [2], [3], [3,4], [3,4,5], [3,4,5,6], [3,4,5,6,7]],
  20: [[1,2,3], [2,3], [3], [4], [4,5], [4,5,6], [4,5,6,7]],
  30: [[1,2,3,4], [2,3,4], [3,4], [4], [5], [5,6], [5,6,7]],
  40: [[1,2,3,4,5], [2,3,4,5], [3,4,5], [4,5], [5], [6], [6,7]]
};

const stepsDockLaneData: { [index: number]: number[] } = {
  10: [3, 2, 2, 4, 6, 8, 9],
  20: [5, 4, 2, 2, 4, 6, 7],
  30: [7, 6, 4, 2, 2, 4, 5],
  40: [9, 8, 6, 4, 2, 2, 3]
};

const checkLaneDockData: { [index: number]: number[][] } = {
  1: [[2,11], [2,3,21], [2,3,4,31], [2,3,4,5,41]],
  2: [[11], [3,21], [3,4,31], [3,4,5,41]],
  3: [[11], [21], [4,31], [4,5,41]],
  4: [[3,11], [21], [31], [5,41]],
  5: [[3,4,11], [4,21], [31], [41]],
  6: [[3,4,5,11], [4,5,21], [5,31], [41]],
  7: [[3,4,5,6,11], [4,5,6,21], [5,6,31], [6,41]]
};

const stepsLaneDockData: { [index: number]: number[] } = {
  1: [2, 4, 6, 8],
  2: [1, 3, 5, 7],
  3: [1, 1, 3, 5],
  4: [3, 1, 1, 3],
  5: [5, 3, 1, 1],
  6: [7, 5, 3, 1],
  7: [8, 6, 4, 2]
};

const checkDockDockData: { [index: number]: number[][] } = {
  10: [[-1], [3,21], [3,4,31], [3,4,5,41]],
  20: [[3,11], [-1], [4,31], [4,5,41]],
  30: [[3,4,11], [4,21], [-1], [5,41]],
  40: [[3,4,5,11], [4,5,21], [5,31], [-1]]
};

const stepsDockDockData: { [index: number]: number[] } = {
  10: [-1, 3, 5, 7],
  20: [3, -1, 3, 5],
  30: [5, 3, -1, 3],
  40: [7, 5, 3, -1]
};

function checkDock(desk: Desk, dock: number, pos: number): boolean {
  if (pos === 1) return true;
  for (let i = 1; i < pos; i++)
    if (desk[dock + i]) return false;
  return true;
}

function checkDockFace(desk: Desk, dock: number, pos: number): boolean {
  const face = desk[dock + pos];
  for (let i = 4; i > pos; i--)
    if (desk[dock + i] && desk[dock + i] !== face) return true;
  return false;
}

function checkDockLane(desk: Desk, dock: Dock, pos: number): number[][] {
  const moves: number[][] = [];
  const d = checkDockLaneData[dock];

  for (let i = 0; i <= 6; i++)
    if (d[i].find(ii => desk[ii] !== null) === undefined)
      moves.push([i+1, stepsDockLaneData[dock][i] + pos]);

  return moves;
}

function checkDockDock(desk: Desk, face: ChipFace, dock: Dock, pos: number): number[][] {
  const d = checkDockDockData[dock][face-1];

  if (d[0] === -1) return [];
  if (d.find(ii => desk[ii] !== null) === undefined) {
    for (let i = 2; i <= 4; i++)
      if (desk[face * 10 + i] && desk[face * 10 + i] !== face)
        return [];
    return [[face*10, stepsDockDockData[dock][face-1] + pos]];
  }

  return [];
}

function checkLaneDock(desk: Desk, face: number, pos: number): number[][] {
  const d = checkLaneDockData[pos][face-1];

  if (d.find(ii => desk[ii] !== null) === undefined) {
    for (let i = 2; i <= 4; i++)
      if (desk[face * 10 + i] && desk[face * 10 + i] !== face)
        return [];
    return [[face*10, stepsLaneDockData[pos][face-1]]];
  }

  return [];
}

function getChipMoves(desk: Desk, chip: Chip): number[][] {
  if (chip.dock > 0) {
    if (chip.dock === chip.face*10 && !checkDockFace(desk, chip.dock, chip.position)) return [];
    if (!checkDock(desk, chip.dock, chip.position)) return [];
    return [...checkDockLane(desk, chip.dock, chip.position), ...checkDockDock(desk, chip.face, chip.dock, chip.position)];
  } else
    return checkLaneDock(desk, chip.face, chip.position);
}

function getMoves(desk: Desk): ChipMove[] {
  const moves: ChipMove[] = [];

  for (let i = 1; i <= 44; i++) {
    if (!desk[i]) continue;
    const c: Chip = {
      face: desk[i] as ChipFace,
      dock: Math.floor(i / 10) * 10 as Dock,
      position: i % 10
    };

    for (const m of getChipMoves(desk, c))
      moves.push({ chip: c, to: m[0], l: m[1] });
  }

  return moves;
}

function init(set: ChipFace[][]): Step[] {
  const desk = new Array(44);
  desk.fill(null, 0);

  for (let c = 0; c <= 3; c++)
    for (let r = 0; r <= 3; r++)
      desk[(c+1)*10+r+1] = set[r][c];

  return [{
    desk: desk,
    moves: getMoves(desk),
    move: '',
    energy: 0
  }];
}

function checkWin(desk: Desk): boolean {
  for (let d = 1; d <= 4; d++)
    for (let r = 1; r <= 4; r++)
      if (desk[d * 10 + r] !== d)
        return false;
  return true;
}

let wins = 0;
let minWin = 1e10;
function makeMove(steps: Step[], prevDesk: Desk, move: ChipMove, energy: number): Step | null {
  const desk = [...prevDesk];

  desk[move.chip.dock + move.chip.position] = null;
  if (move.to >= 10) {
    for (let i = 4; i >= 1; i--)
      if (!desk[move.to + i]) {
        move.to += i;
        desk[move.to] = move.chip.face;
        energy += chipEnergy[move.chip.face] * (move.l + i - 1);
        break;
      }
  } else {
    desk[move.to] = move.chip.face;
    energy += chipEnergy[move.chip.face] * move.l;
  }

  if (checkWin(desk)) {
    wins++;
    if (minWin > energy) {
      minWin = energy;
      console.log(`Win: ${energy} | ${steps.map(s => `${s.move} e${s.energy}, `).join('')}${move.chip.face}: ${move.chip.dock + move.chip.position}→${move.to} e${energy}`);
    }
    return null;
  }

  const moves = getMoves(desk);
  if (moves.length === 0) return null;

  return { desk, moves, energy, move: `${move.chip.face}: ${move.chip.dock + move.chip.position}→${move.to}` };
}

function printDesk(d: Desk) {
  console.log(`${d[1]||'·'}${d[2]||'·'} ${d[3]||'·'} ${d[4]||'·'} ${d[5]||'·'} ${d[6]||'·'}${d[7]||'·'}`);
  console.log(`  ${d[11]||'·'} ${d[21]||'·'} ${d[31]||'·'} ${d[41]||'·'}`);
  console.log(`  ${d[12]||'·'} ${d[22]||'·'} ${d[32]||'·'} ${d[42]||'·'}`);
  console.log(`  ${d[13]||'·'} ${d[23]||'·'} ${d[33]||'·'} ${d[43]||'·'}`);
  console.log(`  ${d[14]||'·'} ${d[24]||'·'} ${d[34]||'·'} ${d[44]||'·'}`);
}

function A(set: ChipFace[][]) {
  const steps = init(set);

  let n = 0;
  while (steps.length > 0) {
    const curStep = steps[steps.length-1];

    if (n % 1_000_000 === 0) {
      console.log(`${n} steps: ${steps.length}`);
      printDesk(curStep.desk);
    }
    n++;

    if (curStep.moves.length === 0) {
      steps.pop();
      continue;
    }

    const curMove = curStep.moves.pop() as ChipMove;

    const s = makeMove(steps, curStep.desk, curMove, curStep.energy);

    if (s)
      steps.push(s as Step);
  }
  console.log(`wins: ${wins}, min energy: ${minWin}, moves: ${n}`);
}

// BCBD
// DCBA
// DBAC
// ADCA
// A([[2,3,2,4],[4,3,2,1],[4,2,1,3],[1,4,3,1]]);

// ACCD
// DCBA
// DBAC
// BDAB
A([[1,3,3,4],[4,3,2,1],[4,2,1,3],[2,4,1,2]]);
