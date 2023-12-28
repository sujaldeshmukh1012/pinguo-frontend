let n = 10;
let str = "";
for (let i = n / 2; i < n; i += 2) {
  for (let j = 1; j < n - i; j += 2) {
    str += " ";
  }
  for (let k = 1; k <= i; k++) {
    str += "*";
  }
  for (let l = 1; l <= n - i; l++) {
    str += " ";
  }
  for (let m = 1; m <= i; m++) {
    str += "*";
  }
  str += "\n";
}
for (let i = n; i > 0; i--) {
  str += "*";
}
console.log(str);
