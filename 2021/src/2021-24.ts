const stepValues = {
//     0    1    2    3    4    5    6    7    8    9   10   11   12   13
  a: [14,  11,  12,  11, -10,  15, -14,  10,  -4,  -3,  13,  -3,  -9, -12],
  b: [ 1,   1,   1,   1,  26,   1,  26,   1,  26,  26,   1,  26,  26,  26],
  c: [16,   3,   2,   7,  13,   6,  10,  11,   6,   5,  11,   4,   4,   6]
// x   0    0    0    0    1    0    1    0    1    1    0    1    1    1
// w   9    9    9    9    6                                                    .
// zm  0   25   12   11   16                                                            .
// zm+a 14 36   24   22    6                                                            .
// *Z 25   12   11   16                                                         .
//                 w1+c == w2-a                                                        .
//                  9+7 == 6+10                                                 .
//                            9+6 == 1+14                                          .
//                                     2+11 == 9+4                                   .
//                                                    1+11 == 9+3                   .
//             9+2                                 8+3                         .
//        9+3                                                      3+9         .
//    5+16                                                             9+12    .

//                 w1+c == w2-a                                                        .
//                  4+7 == 1+10                                                 .
//                            9+6 == 1+14                                          .
//                                     1+11 == 8+4                                   .
//                                                    1+11 == 9+3                   .
//             2+2                                 1+3                         .
//        7+3                                                      1+9         .
//    1+16                                                             5+12    .
};

// if (z mod 26 === w - [a])
//   Z = z / [b];
// else
//   Z = z / [b] * 26 + [c] + w;

function doStep(step: number, w: number, z: number = 0): number {
  if (z % 26 === w - stepValues.a[step])
    return Math.floor(z / stepValues.b[step]);
  else
    return Math.floor(z / stepValues.b[step]) * 26 + stepValues.c[step] + w;
}

function dataToA(data: number): number[] {
  const d: number[] = new Array(14);
  for (let i = 1; i <= 14; i++) {
    d[14-i] = data % 10;
    data = (data - d[14-i]) / 10;
  }
  return d;
}

function A(data: number): number {
  const d = dataToA(data);
  let z = 0;
  for (let i = 0; i <= 13; i++)
    z = doStep(i, d[i], z);
  return z;
}

console.log(A(59996912981939));
console.log(A(17241911811915));
