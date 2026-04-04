function doLottery (numbers, num) {
  const row = [];
  let r;
  for (let i = 0; i < num; i ++) {
    let ok = false;

    while (!ok) {
      ok = true;
      r = Math.floor(Math.random() * numbers) + 1;
      for (let j = 0; j < i + 1; j ++) {
        if (row [j] === r) {
          ok = false;
        }
      }
    }
    row[i] = r;
  }
  return row;
}

const lottery = doLottery(40,7);
for (let i = 0; i < lottery.length; i++) {
    console.log(lottery[i]);
}