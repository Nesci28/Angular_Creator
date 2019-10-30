const mainPrompt = require('./mainPrompt');
const gitPrompt = require('./gitPrompt');

const cmdAngular = require('./cmdAngular');
const cmdTheme = require('./cmdTheme');
const cmdTesting = require('./cmdTesting');

const helpers = require('./helpers');

const prependFile = require('prepend-file');

const fs = require('fs');
const cp = require('child_process');

(async () => {
  const answers = await mainPrompt();
  if (answers.git && answers.gitProvider === 'GitHub') {
    gitPrompt.gitHub(answers.gitUsername);
  }
  if (answers.git && answers.gitProvider === 'GitLab') {
    gitPrompt.gitLab(answers.gitUsername);
  }
  if (answers.git && answers.gitProvider === 'BitBucket') {
    gitPrompt.bitbucket(answers.gitUsername);
  }

  const startTime = Date.now();
  let toNull;
  process.platform === 'win32'
    ? (toNull = 'nul 2>&1')
    : (toNull = '/dev/null 2>&1');

  process.chdir(answers.path);

  cmdAngular(answers);
  cmdTheme(answers);
  cmdTesting(answers);

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

  if (answers.git) {
    let gitLink;
    if (answerGitHub.gitPath) gitLink = answerGitHub.gitPath;
    if (answerGitLab.gitPath) gitLink = answerGitLab.gitPath;
    if (answerBitBucket.gitPath) gitLink = answerBitBucket.gitPath;

    helpers.printMsg('Linking to git...');
    cp.execSync(`git add . > ${toNull}`);
    cp.execSync(`git commit -m 'first commit' > ${toNull}`);
    cp.execSync(`git remote add origin ${gitLink} > ${toNull}`);
    cp.execSync(`git push -u origin master > ${toNull}`);
    helpers.printDone('Linking to git...');
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

  process.stdout.write(
    `Done in ${(Math.round((Date.now() - startTime) / 1000) / 60).toFixed(
      2,
    )} mins`,
  );
})();
