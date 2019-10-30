const cp = require('child_process');
const path = require('path');

const helpers = require('./helpers');

module.exports = function(answers) {
  // Generating the command
  let angularNewCommand = `ng new ${answers.name}`;
  if (answers.routing) angularNewCommand += ` --routing=true`;
  if (!answers.testing) angularNewCommand += ` --skipTests=true`;
  if (!answers.framework) {
    angularNewCommand += ` --style=scss`;
  } else {
    angularNewCommand += ` --style=${answers.framework}`;
  }
  if (!answers.git) {
    angularNewCommand += ` --commit=false`;
  }
  angularNewCommand += ` --skipInstall=true`;

  // Running the commands
  if (answers.version === 'latest') {
    helpers.printMsg('Updating Angular-CLI...');
    if (answers.yarn) {
      cp.execSync(`yarn global add @angular/cli@latest > ${toNull}`);
    } else {
      cp.execSync(`npm install -g @angular/cli@latest > ${toNull}`);
    }
    helpers.printDone('Updating Angular-CLI...');
    helpers.printMsg('Creating the Angular App ...');
    cp.execSync(`${angularNewCommand} > ${toNull}`);
  } else {
    let version;
    try {
      version = cp.execSync(`npx -version`).toString();
    } catch (error) {
      helpers.printMsg('Installing NPX...');
      if (answers.yarn) {
        cp.execSync(`yarn global add npx > ${toNull}`);
      } else {
        cp.execSync(`npm install -g npx > ${toNull}`);
      }
      helpers.printDone('Installing NPX...');
    }
    if (version) {
      helpers.printMsg('Creating the Angular App ...');
      if (answers.yarn) helpers.printWarning('Using NPX');
      cp.execSync(
        `npx -p @angular/cli@${answers.version} ${angularNewCommand} > ${toNull}`,
      );
    }
  }

  helpers.printDone('Creating the Angular App ...');
  process.chdir(path.join(answers.path, answers.name));

  helpers.printMsg('Installing Angular dependancies...');
  if (answers.yarn) {
    cp.execSync('yarn install');
  } else {
    cp.execSync('npm install');
  }
  helpers.printDone('Installing Angular dependancies...');
};
