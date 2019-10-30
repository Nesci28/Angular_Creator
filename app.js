const promptMain = require('./promptMain');
const promptGit = require('./promptGit');

const cmdAngular = require('./cmdAngular');
const cmdTheme = require('./cmdTheme');
const cmdTesting = require('./cmdTesting');
const cmdGit = require('./cmdGit');

const helpers = require('./helpers');

const prependFile = require('prepend-file');

const fs = require('fs');
const cp = require('child_process');

(async () => {
  const answers = await promptMain();

  let gitName;
  if (answers.git && answers.gitProvider === 'GitHub' && answers.gitNew) {
    gitName = await promptGit.gitName(answers);
    gitName = gitName.gitName;
  }
  let gitLink;
  if (answers.git && answers.gitProvider === 'GitHub' && !answers.gitNew) {
    gitLink = await promptGit.gitHub(answers.gitUsername);
  }
  if (answers.git && answers.gitProvider === 'GitLab' && !answers.gitNew) {
    gitLink = await promptGit.gitLab(answers.gitUsername);
  }
  if (answers.git && answers.gitProvider === 'BitBucket' && !answers.gitNew) {
    gitLink = await promptGit.bitbucket(answers.gitUsername);
  }

  const startTime = Date.now();
  const toNull = process.platform === 'win32' ? 'nul 2>&1' : '/dev/null 2>&1';

  process.chdir(answers.path);

  cmdAngular(answers, toNull);
  cmdTheme(answers, toNull);
  cmdTesting(answers, toNull);

  if (answers.hammer) {
    helpers.printMsg('Installing HammerJS...');
    if (answers.yarn) {
      cp.execSync(`yarn install hammerjs > ${toNull}`);
    } else {
      cp.execSync(`npm install hammerjs > ${toNull}`);
    }
    prependFile('src/main.ts', "import 'hammerjs';", () => {});
    helpers.printDone('Installing HammerJS...');
  }

  helpers.printMsg('Configuring TSLint...');
  fs.readFile('tslint.json', (_, data) => {
    data = tslint;
    fs.writeFile('tslint.json', JSON.stringify(data, null, 2), () => {});
  });
  if (fs.existsSync('src/tslint.json')) {
    fs.readFile('./src/tslint.json', (_, data) => {
      data = tslintSrc;
      fs.writeFile('src/tslint.json', JSON.stringify(data, null, 2), () => {});
    });
  }
  helpers.printDone('Configuring TSLint...');

  if (answers.git) {
    cmdGit(answers, gitLink, toNull, gitName);
  }

  process.stdout.write(
    `Done in ${(Math.round((Date.now() - startTime) / 1000) / 60).toFixed(
      2,
    )} mins`,
  );
})();
