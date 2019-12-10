const cp = require('child_process');
const fs = require('fs');

const helpers = require('./helpers');

module.exports = async function(answers, toNull) {
  if (answers.themeFrame === 'Bootstrap') {
    helpers.printMsg('Installing Bootstrap...');
    if (answers.yarn) {
      cp.execSync(`yarn add bootstrap > ${toNull}`);
    } else {
      cp.execSync(`npm install bootstrap > ${toNull}`);
    }
    cp.execSync(`ng add ngx-bootstrap > ${toNull}`);
    helpers.printDone('Installing Bootstrap...');

    if (answers.themeRes) {
      helpers.printMsg('Installing Bootswatch...');
      if (answers.yarn) {
        cp.execSync(`yarn add bootswatch > ${toNull}`);
      } else {
        cp.execSync(`npm install bootswatch > ${toNull}`);
      }
      fs.writeFileSync(
        'src/styles.scss',
        `@import "~bootswatch/dist/${answers.theme}/variables";\n`,
      );
      fs.appendFileSync(
        'src/styles.scss',
        `@import "~bootstrap/scss/bootstrap";\n`,
      );
      fs.appendFileSync(
        'src/styles.scss',
        `@import "~bootswatch/dist/${answers.theme}/bootswatch";\n`,
      );
      helpers.printDone('Installing Bootswatch...');
    }
  }

  if (answers.themeFrame === 'Material') {
    helpers.printMsg('Installing Material...');
    cp.execSync(`ng add @angular/material  > ${toNull}`);
    helpers.printDone('Installing Material...');

    if (answers.materialTheme !== 'custom') {
      helpers.printMsg('Adding Material Theme...');
      prependFile(
        'src/styles.scss',
        `@import '@angular/material/prebuilt-themes/${answers.materialTheme}.css';`,
      );
      helpers.printDone('Adding Material Theme...');
    }
  }

  if (answers.themeFrame === 'MDB') {
    helpers.printMsg('Installing Material for Bootstrap...');
    cp.execSync('ng add angular-bootstrap-md');
    helpers.printDone('Installing Material for Bootstrap...');
  }

  if (answers.fontAwesome) {
    helpers.printMsg('Installing Font Awesome...');
    if (answers.yarn) {
      cp.execSync(`yarn add font-awesome > ${toNull}`);
    } else {
      cp.execSync(`npm install font-awesome > ${toNull}`);
    }
    fs.writeFileSync('src/index.html', html);
    helpers.printDone('Installing Font Awesome...');
  }
};

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CodeWars</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
      crossorigin="anonymous"
    />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`;
