import { readFileSync } from 'fs';

function getData(fileName: string) : string[] {
  try {
    return readFileSync(fileName, 'utf-8').split("\n"); //.map(s => s.split(''));
  } catch (err) {
    console.error(err);
    return [];
  }
}

const brackets: { [id: string]: string } = { '(': ')', '[': ']', '{': '}', '<': '>' };
const scoresBad: { [id: string]: number } = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const scoresOpen: { [id: string]: number } = { ')': 1, ']': 2, '}': 3, '>': 4 };

function parseBrackets(s: string) {
  const bracket = s.substring(0, 1);
  if (!brackets[bracket]) throw ['bad opener', bracket];
  
  if (s.length < 2) throw ['open-ended', brackets[bracket]];

  let remainder = s.substring(1);
  while (!!brackets[remainder.substring(0, 1)])
    remainder = parseBrackets(remainder);

  if (remainder.length < 1) throw ['open-ended', brackets[bracket]];
  if (remainder.substring(0, 1) !== brackets[bracket]) throw ['bad closer', remainder.substring(0, 1), brackets[bracket]];
  
  return remainder.substring(1);
}

function A(fileName: string): number {
  const code = getData(fileName);

  let score = 0;

  code.forEach(line => {
    try {
      while (line.length > 0)
        line = parseBrackets(line);
    } catch(e) {
      if (e instanceof Array) {
        if (e[0] === 'bad closer')
          score += scoresBad[e[1]];
      }

      // console.log(line, 'error:', e);
    }
  });

  return score;
}

function fixBrackets(s: string, scores: string[]) {
  const bracket = s.substring(0, 1);
  if (!brackets[bracket]) throw ['bad opener', bracket];
  
  if (s.length < 2) {
    scores.push(brackets[bracket]);
    return '';
  }

  let remainder = s.substring(1);
  while (!!brackets[remainder.substring(0, 1)])
    remainder = fixBrackets(remainder, scores);

  if (remainder.length < 1) {
    scores.push(brackets[bracket]);
    return '';
  }

  if (remainder.substring(0, 1) !== brackets[bracket]) throw ['bad closer', remainder.substring(0, 1), brackets[bracket]];
  
  return remainder.substring(1);
}

function B(fileName: string): number {
  const code = getData(fileName);

  const totalScores: number[] = [];

  code.forEach(line => {
    const scores: string[] = [];
    let error = false;
    try {
      while (line.length > 0)
        line = fixBrackets(line, scores);
    } catch(e) {
      if (e instanceof Array) {}
      console.log(line, 'error:', e);
      error = true;
    } finally {
      if (!error) {
        let totalScore = 0;
        scores.forEach(s => totalScore = totalScore * 5 + scoresOpen[s]);
        console.log(line, 'score:', totalScore);
        totalScores.push(totalScore);
      }
    }
  });

  totalScores.sort((a,b) => a > b ? 1 : -1);
  console.log(totalScores);
  return totalScores[Math.floor(totalScores.length / 2)];
}


console.log(A('2021-10-input-sample'));
console.log(A('2021-10-input'));
console.log(B('2021-10-input-sample'));
console.log(B('2021-10-input'));
