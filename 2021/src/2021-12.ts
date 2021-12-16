import {readFileSync} from 'fs';

function getData(fileName: string) : string[][] {
  try {
    // xz-end
    // CJ-pt
    return readFileSync(fileName, 'utf-8').split("\n").map(s => s.split('-'));
  } catch (err) {
    console.error(err);
    return [];
  }
}

type caveList = { [id: string]: Cave };

class Cave {
  readonly name: string;
  readonly type: 'start' | 'end' | 'large' | 'small';
  caves: caveList;
  paths: Cave[];

  constructor(name: string, caves: caveList) {
    this.name = name;
    if (name === 'start')
      this.type = 'start';
    else if (name === 'end')
      this.type = 'end';
    else if (name.match(/[A-Z]/))
      this.type = 'large';
    else 
      this.type = 'small';

    caves[name] = this;
    this.caves = caves;
    this.paths = [];
  }

  connect(data: string[]) {
    if (this.type === 'end') return;
    if (data[0] !== this.name && data[1] !== this.name) return;

    const caveTo = this.caves[data[data[0] !== this.name ? 0 : 1]];
    if (caveTo.type === 'start') return;

    this.paths.push(caveTo);
  }

  disconnect(names: string[]) {
    names.forEach(name => {
      const i = this.paths.findIndex((cave) => cave.name === name);
      if (i !== -1)
        this.paths.splice(i,1);
    });
  }

  numPathsA(path: string[]): number {
    if (this.type === 'small' && path.indexOf(this.name) !== -1) return 0;
    if (this.type === 'end') {
      // console.log([...path, this.name].join(' → '));
      return 1;
    }

    return this.paths.reduce((sum, c) => sum + c.numPathsA([...path, this.name]), 0);
  }

  numPathsB(path: string[], visited: boolean): number {
    if (this.type === 'small' && path.indexOf(this.name) !== -1) {
      if (visited) return 0;
      visited = true;
    }

    if (this.type === 'end') {
      console.log([...path, this.name].join(' → '));
      return 1;
    }

    return this.paths.reduce((sum, c) => sum + c.numPathsB([...path, this.name], visited), 0);
  }
}

function buildMap(data: string[][]): caveList {
  const caves: caveList = {};

  data.forEach(c => {
    if (!caves[c[0]]) new Cave(c[0], caves);
    if (!caves[c[1]]) new Cave(c[1], caves);

    for (let caveName in caves)
      caves[caveName].connect(c);
  });

  // const caveStubs: string[] = [];
  // for (let caveName in caves)
  //   if (
  //     caves[caveName].type === 'small'
  //     && caves[caveName].paths.length === 1
  //     && caves[caveName].paths[0].type === 'small'
  //   )
  //     caveStubs.push(caveName);

  // for (let caveName in caves)
  //   caves[caveName].disconnect(caveStubs);
  
  // caveStubs.forEach(c => {
  //   console.log(`${c} is a stub`);
  //   delete caves[c];
  // });
  // console.log();

  return caves;
}

function A(fileName: string): number {
  const caves = buildMap(getData(fileName));
  // console.log(caves);
  for (let caveName in caves)
    console.log(`${caveName}: ${caves[caveName].paths.map(c => c.name).join(' ')}`);
  console.log();

  return caves['start'].numPathsA([]);
}

function B(fileName: string): number {
  const caves = buildMap(getData(fileName));

  return caves['start'].numPathsB([], false);
}

// console.log(A('2021-12-input-sample'));
console.log(A('2021-12-input'));
// console.log(B('2021-12-input-sample'));
console.log(B('2021-12-input'));
