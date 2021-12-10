const myPromise = new Promise((resolve) => {
    setTimeout(() => {
        resolve('foo');
    }, 300);
});

const myPromiseFail1 = () => {
    console.log(`called Fail`);
    return Promise.reject('doh');
};

const myPromiseFail2 = () => new Promise((resolve, reject) => {
    console.log(`called Fail`);
    reject('doh');
});

const p1 = myPromise
.then(value => {
    console.log(`called 1`);
    return value + ' and bar';
})
.then(value => {
    console.log(`called 2`);
    return value + ' and bar again';
});

p1.then(value => {
    console.log(`called 3`);
    return value + ' and again1';
})
.then(value => {
    console.log(`called 4`);
    return value + ' and again2';
 })
.then(value => { console.log(`2: val ${value}`) })
.catch(err => { console.log(`2: err ${err}`) })
.finally(() => console.log('2: final'));

p1.then(myPromiseFail2)
.then(value => { console.log(`1: val ${value}`) })
.catch(err => { console.log(`1: err ${err}`) })
.finally(() => console.log('1: final'));
