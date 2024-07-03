const range = 10;

if (range <= 1) console.log(range, false);

for (let i = 1; i <= range; i++) {
  if (i % 2 === 0) {
    console.log(i, true);
  } else {
    console.log(i, false);
  }
}

// 1 false
// 2 true
// 3 false
// 4 true
// 5 false
// 6 true
// 7 false
// 8 true
// 9 false
// 10 true