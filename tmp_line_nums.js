const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
const targets = ['function getField', 'function createDealCard', 'function renderNews'];
lines.forEach((line, index) => {
  targets.forEach((target) => {
    if (line.includes(target)) console.log(`${index + 1}: ${line.trim()}`);
  });
});
