import { readFileSync } from 'fs';

type Commands = {[id: string]: string};
type StringData = {[id: string]: number};

function getData(fileName: string) : [string, Commands] {
  try {
    // NNCB
    // CH -> B
    const fileData = readFileSync(fileName, 'utf-8').split("\n\n");
    const commands: Commands = {};
    fileData[1].split("\n").forEach(s => {
      const c = s.split(' -> ');
      commands[c[0]] = c[1];
    });

    return [fileData[0], commands];
  } catch (err) {
    console.error(err);
    return ['',{}];
  }
}

function stepA(str: string, data: Commands): string {
  let result = str;

  for (let i = str.length - 1; i > 0; i--) {
    const substring = str.substring(i-1, i+1);
    result = result.substring(0, i) + data[substring] + result.substring(i);
  }

  return result;
}

function stepB(str: StringData, data: Commands): StringData {
  let result: StringData = {};

  for (let s in str) {
    const key1 = s[0] + data[s];
    const key2 = data[s] + s[1];
    if (!result[key1]) result[key1] = str[s]; else result[key1] += str[s];
    if (!result[key2]) result[key2] = str[s]; else result[key2] += str[s];
  }

  return result;
}

function countElements(str: string): StringData {
  const res: StringData = {};

  str.split('').forEach(s => {
    if (!res[s]) res[s] = 1; else res[s]++;
  });

  return res;
}

function A(fileName: string): number {
  let [str, data] = getData(fileName);

  for (let i = 0; i < 10; i++) {
    str = stepA(str, data);
    console.log(`Step ${i}: ${str.length}`);
  }

  const res = countElements(str);
  console.log(res);
  
  let max = 0;
  let min = 1e100;
  for (let i in res) {
    if (res[i] > max) max = res[i];
    if (res[i] < min) min = res[i];
  }

  return max - min;
}

function B(fileName: string): number {
  let [str, data] = getData(fileName);

  let strbreak: StringData = {};

  for (let i = str.length - 1; i > 0; i--) {
    const substring = str.substring(i-1, i+1);
    if (!strbreak[substring]) strbreak[substring] = 1; else strbreak[substring]++;
  }

  for (let i = 0; i < 40; i++)
    strbreak = stepB(strbreak, data);

  const chars: StringData = {};
  for (let s in strbreak) {
    if (!chars[s[0]]) chars[s[0]] = strbreak[s]; else chars[s[0]] += strbreak[s];
    if (!chars[s[1]]) chars[s[1]] = strbreak[s]; else chars[s[1]] += strbreak[s];
  }

  let max = 0;
  let min = 1e100;
  for (let c in chars) {
    if (c === str[0] || c === str[str.length-1]) chars[c]++;
    chars[c] /= 2;
    if (chars[c] > max) max = chars[c];
    if (chars[c] < min) min = chars[c];
  }

  console.log(chars);
  return max - min;
}

console.log(A('2021-14-input-sample'));
console.log(A('2021-14-input'));
console.log(B('2021-14-input-sample'));
console.log(B('2021-14-input'));
