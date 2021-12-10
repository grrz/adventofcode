import { readFileSync } from 'fs';

function getData() : number[] {
    try {
        const fileData = readFileSync('2021-01-input', 'utf-8');
        return fileData.split("\n").map((s: string) => +s);
    } catch (err) {
        console.error(err);
        return [];
    }
}

function A1(): number {
    let n = 0;
    let aPrev: number | null = null;

    getData().forEach((a) => {
        if (aPrev !== null && a > aPrev)
            n++;
        aPrev = a;
    });

    return n;
}

function A2(): number {
    let n = 0;
    const data = getData();

    let i = 1;
    while (i < data.length) {
        if (data[i] > data[i-1])
            n++;
        i++;
    }
    return n;
}

function B(): number {
    let n = 0;
    const data = getData();

    let i = 3;
    while (i < data.length) {
        if (data[i] > data[i-3])
            n++;
        i++;
    }

    return n;
}

console.log(A1());
console.log(A2());
console.log(B());
