const clk = require('chalk');

module.exports = {
  printMsg: str => {
    process.stdout.write('🔲 ' + ' - ' + clk.blue(str));
  },
  printDone: str => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('✅ ' + ' - ' + clk.green(str) + '\n');
  },
  printWarning: str => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('⚠️ ' + ' - ' + clk.yellow(str) + '\n');
  },
};
