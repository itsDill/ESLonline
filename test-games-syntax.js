const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('games/games.html', 'utf8');
const match = html.match(/const games = \[([\s\S]*?)\];/);

if (!match) {
  console.error('Could not find games array');
  process.exit(1);
}

const gamesCode = `
  const games = [${match[1]}];
  module.exports = { games };
`;

try {
  const result = vm.runInNewContext(gamesCode + ' module.exports.games');
  console.log('✓ Syntax OK: Games array has', result.length, 'games');
  console.log('✓ Game 1:', result[0].title, '- seasonal:', result[0].seasonal);
  console.log('✓ Game 5:', result[4].title, '- seasonal:', result[4].seasonal);
} catch (e) {
  console.error('✗ Syntax error:', e.message);
  process.exit(1);
}
