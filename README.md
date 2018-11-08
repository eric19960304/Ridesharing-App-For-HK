**HKUCS FYP Ridesharing App**

Back-end server repo: https://github.com/eric19960304/FYP-Server


Prerequisite:

1. Nodejs v8.x.x installed (npm command avaliable)

2. Install Expo app in your smartphone


Installation:

`npm install`

Run:

`npm start`


-----------------------
**Something about Javascript (>ES7)**

use const/let instead of var (though var is still available)

```
const a = 1;
let b = 2;

a = 2; <--- error
b = 3; <--- ok
```

use arrow function instead of 'function' keyword (though 'function' is still available)

```
// old way
function add(a, b){
  return a+b;
}

function printInt(n){
  console.log(n);
}

// new way
const add = (a,b) => a+b;
const printInt = n => { console.log(n); };
```

object operation

```
var a=1, b=2, c=3;
// old way
var obj = {
  a: a, 
  b: b, 
  c: c
};
// new way
const obj = {
  a,     // a:a, -> a, if the key in obj is same as the variable's name
  b, 
  c 
};


var obj2 = {
  x: 1, 
  y:2, 
  z:3
};
// old way
var x = obj2.x, y = obj2.y, z = obj2.z;
// new way
const { x, y, z } = obj2;
```

async await
- async function will not block the execution thread
- two common ways to deal with async function, .then .catch and await
- note: only async function can use await keyword, and must be wrapped by try catch block

```
assume storage.get(key) is an async function.

// .then .catch
storage.get('user')
.then( value => {
  console.log('user: ', value);
})
.catch( error => {
  console.log(error);
});

// async call inside another async function (benefit: can return received value to caller)
try{
  const value = await  storage.get('user');
  console.log('user: ', value);
  return value;
}catch(error){
  console.log(error);
  return none;
};
```
