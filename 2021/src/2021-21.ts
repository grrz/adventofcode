// Player 1 starting position: 10
// Player 2 starting position: 2

let dieA = 0;
let dieRolls = 0;

function rollA(): number {
  dieRolls++;
  dieA++;
  if (dieA > 100) dieA = 1;
  return dieA;
}

function moveA(pos: number): number {
  pos = (pos + rollA() + rollA() + rollA() - 1) % 10 + 1;
  return pos;
}

function A(p1: number, p2: number): number {
  let p = 0;
  const pPos = [p1, p2];
  const pScore = [0,0];

  while (true) {
    pPos[p] = moveA(pPos[p]);
    pScore[p] += pPos[p];
    if (pScore[p] >= 1000) break;
    p = 1 - p;
  }

  return pScore[1-p] * dieRolls;
}

const turnVariants: {[index: number]: number} = { 3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1 };
const winScore = 21;
const maxGames = 21 * 21 * 11 * 11 * 2;
type Game = {
  p1Score: number,
  p2Score: number,
  p1Pos: number,
  p2Pos: number,
  currentPlayer: number
};

function gameIndex(g: Game): number {
  return (((g.p1Score * 21 + g.p2Score) * 11 + g.p1Pos) * 11 + g.p2Pos) * 2 + g.currentPlayer;
}

function gameFromIndex(index: number): Game {
  const g = { p1Score: 0, p2Score: 0, p1Pos: 0, p2Pos: 0, currentPlayer: 0 };
  g.currentPlayer = index % 2;
  index = (index - g.currentPlayer) / 2;
  g.p2Pos = index % 11;
  index = (index - g.p2Pos) / 11;
  g.p1Pos = index % 11;
  index = (index - g.p1Pos) / 11;
  g.p2Score = index % 21;
  g.p1Score = (index - g.p2Score) / 21;
  return g;
}

let p1Wins = 0;
let p2Wins = 0;

function B(p1: number, p2: number): number {
  const games: number[] = new Array(maxGames);
  games.fill(0,0);
  games[gameIndex({p1Score: 0, p2Score: 0, p1Pos: p1, p2Pos: p2, currentPlayer: 0})] = 1;

  console.log(`Games: ${maxGames}`);
  for (let gi = 0; gi < maxGames; gi++) {
    if (games[gi] === 0) continue;


    for (let i = 3; i <= 9; i++) {
      const game = gameFromIndex(gi);
      if (game.currentPlayer === 0) { // p1
        game.p1Pos = (game.p1Pos + i - 1) % 10 + 1;
        game.p1Score += game.p1Pos;
        if (game.p1Score >= winScore) {
          p1Wins += games[gi] * turnVariants[i];
          continue;
        }
        game.currentPlayer = 1;
      } else { // p2
        game.p2Pos = (game.p2Pos + i - 1) % 10 + 1;
        game.p2Score += game.p2Pos;
        if (game.p2Score >= winScore) {
          p2Wins += games[gi] * turnVariants[i];
          continue;
        }
        game.currentPlayer = 0;
      }

      const ngi = gameIndex(game);
      if (ngi < gi)
        console.log(gi, ngi);
      games[ngi] += games[gi] * turnVariants[i];
    }
  }

  console.log(`Totals: ${p1Wins}, ${p2Wins}`);

  return p1Wins > p2Wins ? p1Wins : p2Wins;
}

// console.log(A(4, 8));
// console.log(A(10, 2));
console.log(B(4, 8));
// console.log(B(10, 2));
