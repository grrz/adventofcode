import { readFileSync } from 'fs';

function getData(fileName: string) : string[] {
  try {
    return readFileSync(fileName, 'utf-8').split("\n").map(r => r.split('').map(s =>
      ('000' + parseInt(s, 16).toString(2)).slice(-4)
    ).join(''));
  } catch (err) {
    console.error(err);
    return [];
  }
}

let getBitsPos = 0;
function getBits(s: string, n: number): number {
  const data = s.substring(getBitsPos, getBitsPos + n);
  getBitsPos += n;
  return parseInt(data, 2);
}

function getBitsS(s: string, n: number): string {
  const data = s.substring(getBitsPos, getBitsPos + n);
  getBitsPos += n;
  return data;
}

function getIsData(s: string): boolean {
  return s.substring(getBitsPos).indexOf('1') !== -1;
}

function getValue(s: string): [number, number] {
  let res = '';
  let len = 0;
  while (true) {
    const cont = getBits(s, 1);
    res += getBitsS(s, 4);
    len += 5;
    if (cont === 0) break;
  }
  return [parseInt(res, 2), len];
}

type Packet = { ver: number, type: number, len: number, value: number, valtype: 'data' | 'o_bits' | 'o_packets' };

function getPacket(s:string): Packet {
  const p: Packet = {
    ver: getBits(s, 3),
    type: getBits(s, 3),
    value: 0,
    valtype: 'data',
    len: 6
  };

  if (p.type === 4) {
    p.valtype = 'data';
    let l: number;
    [p.value, l] = getValue(s);
    p.len += l;
  } else {
    const ltype = getBits(s, 1) === 1;
    p.valtype = ltype ? 'o_packets' : 'o_bits';
    p.value = getBits(s, ltype ? 11 : 15);
    p.len += ltype ? 12 : 16;
  }

  // console.log(p);

  return p;
}

function A(s: string): number {
  getBitsPos = 0;

  let sum = 0;
  while (getIsData(s)) {
    sum += getPacket(s).ver;
  }

  return sum;
}

function calcPacket(s: string, p: Packet): Packet {
  if (p.valtype === 'data') return p;

  const ps: Packet[] = [];

  while (p.value > 0) {
    const newp = calcPacket(s, getPacket(s));
    ps.push(newp);
    p.value -= p.valtype === 'o_bits' ? newp.len : 1;
    p.len += newp.len;
  }

  switch (p.type) {
    case 0:
      p.value = 0;
      ps.forEach(pp => p.value += pp.value);
      break;
    case 1:
      p.value = 1;
      ps.forEach(pp => p.value *= pp.value);
      break;
    case 2:
      p.value = Infinity;
      ps.reduce((pp, pc) => { if (pc.value < pp.value) pp.value = pc.value; return pp; }, p);
      break;
    case 3:
      p.value = 0;
      ps.reduce((pp, pc) => { if (pc.value > pp.value) pp.value = pc.value; return pp; }, p);
      break;
    case 5:
      p.value = ps[0].value > ps[1].value ? 1 : 0;
      break;
    case 6:
      p.value = ps[0].value < ps[1].value ? 1 : 0;
      break;
    case 7:
      p.value = ps[0].value === ps[1].value ? 1 : 0;
      break;
    default:
      throw `bad type: ${p.type}`;
  }

  return p;
}

function B(s: string): number {
  getBitsPos = 0;
  return calcPacket(s, getPacket(s)).value;
}

getData('2021-16-input').forEach(s => console.log(A(s)));
getData('2021-16-input').forEach(s => console.log(B(s)));
