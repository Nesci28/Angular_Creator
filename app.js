const inquirer = require('inquirer');
const clk = require('chalk');
const rimraf = require('rimraf');
const prependFile = require('prepend-file');

const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const tslintSrc = {
  extends: '../tslint.json',
  rules: {
    'directive-selector': [true, 'attribute', 'app', 'camelCase'],
    'component-selector': [true, 'element', 'app', 'kebab-case'],
  },
};

const tslint = {
  rulesDirectory: ['codelyzer', 'dist/out-tsc/tslintrules'],
  rules: {
    'arrow-return-shorthand': true,
    'callable-types': true,
    'class-name': true,
    'comment-format': [true, 'check-space'],
    curly: true,
    deprecation: {
      severity: 'warn',
    },
    eofline: true,
    forin: true,
    'import-blacklist': [true, 'rxjs/Rx'],
    'import-spacing': true,
    indent: [true, 'spaces'],
    'interface-over-type-literal': true,
    'label-position': true,
    'max-line-length': [true, 140],
    'member-access': false,
    'member-ordering': [
      true,
      {
        order: [
          'static-field',
          'instance-field',
          'static-method',
          'instance-method',
        ],
      },
    ],
    'no-arg': true,
    'no-bitwise': true,
    'no-console': [true, 'log', 'debug', 'info', 'time', 'timeEnd', 'trace'],
    'no-construct': true,
    'no-debugger': true,
    'no-duplicate-super': true,
    'no-empty': false,
    'no-empty-interface': true,
    'no-eval': true,
    'no-inferrable-types': [true, 'ignore-params'],
    'no-misused-new': true,
    'no-non-null-assertion': true,
    'no-redundant-jsdoc': false,
    'no-shadowed-variable': true,
    'no-string-literal': false,
    'no-string-throw': true,
    'no-switch-case-fall-through': true,
    'no-trailing-whitespace': true,
    'no-unnecessary-initializer': true,
    'no-unused-expression': true,
    'no-use-before-declare': true,
    'no-var-keyword': true,
    'object-literal-sort-keys': false,
    'one-line': [
      true,
      'check-open-brace',
      'check-catch',
      'check-else',
      'check-whitespace',
    ],
    'prefer-const': true,
    quotemark: [true, 'single'],
    radix: true,
    semicolon: [true, 'always'],
    'triple-equals': [true, 'allow-null-check'],
    'typedef-whitespace': [
      true,
      {
        'call-signature': 'nospace',
        'index-signature': 'nospace',
        parameter: 'nospace',
        'property-declaration': 'nospace',
        'variable-declaration': 'nospace',
      },
    ],
    'unified-signatures': true,
    'variable-name': false,
    whitespace: [
      true,
      'check-branch',
      'check-decl',
      'check-operator',
      'check-separator',
      'check-type',
    ],
    'no-output-on-prefix': true,
    'use-input-property-decorator': true,
    'use-output-property-decorator': true,
    'use-host-property-decorator': true,
    'no-input-rename': true,
    'no-output-rename': true,
    'use-life-cycle-interface': true,
    'use-pipe-transform-interface': true,
    'component-class-suffix': true,
    'directive-class-suffix': true,
    'no-implicit-dependencies': [true, 'dev'],
    'no-provided-in-root': true,
  },
};

(async () => {
  const startTime = Date.now();
  let toNull;
  if (process.platform === 'win32') {
    toNull = 'nul 2>&1';
  } else {
    toNull = '/dev/null 2>&1';
  }
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: 'Which Angular Version ? 💂 ',
      choices: ['5', '6', '7', '8', 'latest'],
      default: 'latest',
      filter: t => {
        return t === '5' ? '1' : t;
      },
    },
    {
      type: 'text',
      name: 'name',
      message: 'Project Name? 🤔 (non alpha characters will be stripped out)\n',
      filter: t => {
        return t.replace(/[^a-zA-Z]/g, '');
      },
    },
    {
      type: 'confirm',
      name: 'routing',
      message: 'Do you want Routing? 🚧 ',
      default: true,
    },
    {
      type: 'confirm',
      name: 'fontAwesome',
      message: 'Font Awesome icons? ⛳ ',
      default: true,
    },
    {
      type: 'list',
      name: 'themeFrame',
      message: 'Which framework theme do you want? ✒️',
      choices: [
        'Bootstrap',
        'Material',
        'MDB (Material Design for Bootstrap)',
        'None',
      ],
      filter: t => {
        return t === 'MDB (Material Design for Bootstrap)' ? 'MDB' : t;
      },
    },
    {
      type: 'confirm',
      name: 'themeRes',
      message: 'Bootswatch Theme? 🎒 ',
      default: true,
      when: answers => {
        return answers.themeFrame === 'Boostrap';
      },
    },
    {
      type: 'list',
      name: 'theme',
      message: 'Which Bootswatch Theme? 📝 ',
      choices: [
        'Cerulean - A calm blue sky',
        'Cosmo - An ode to Metro',
        'Cyborg - Jet black and electric blue',
        'Darly - Flatly in night mode',
        'Flatly - Flat and modern',
        'Journal - Crisp like a new shoot of paper',
        'Litera - The medium is the message',
        'Lumen - Light and shadow',
        'Lux - A touch of class',
        'Materia - Material is the metaphor',
        'Minty - A fresh feel',
        'Pulse - A trace of purple',
        'Sandstone - A touch of warmth',
        'Simplex - Mini and minimalist',
        'Sketchy - A hand-drawn look for mockups and mirth',
        'Slate - Shades of gunmetal gray',
        'Solar - A spin on Solarized',
        'Spacelab - Silvery and sleek',
        'Superhero - The brave and the blue',
        'United - Ubuntu orange and unique font',
        'Yeti - A friendly foundation',
      ],
      when: answers => {
        return answers.themeRes;
      },
      filter: t => {
        return t.split(' - ')[0].toLowerCase();
      },
    },
    {
      type: 'list',
      name: 'materialTheme',
      message: 'Which Material Theme ? 📝 ',
      choices: [
        'deeppurple-amber',
        'indigo-pink',
        'pink-bluegrey',
        'purple-green',
        'custom',
      ],
      when: answers => {
        return answers.themeFrame === 'Material';
      },
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Which CSS Framework ? 🎖️ ',
      choices: ['scss', 'css', 'sass', 'less', 'styl'],
      default: 'scss',
      when: answers => {
        return answers.themeFrame === 'None';
      },
    },
    {
      type: 'confirm',
      name: 'testing',
      message: 'Do you want Testing? ☢️ ',
      default: true,
    },
    {
      type: 'confirm',
      name: 'testFrame',
      message:
        'Do you want to user Jest instead of Karma/Jasmine/Protactor ? ⚙️ ',
      default: true,
      when: answers => {
        return answers.testing;
      },
    },
    {
      type: 'confirm',
      name: 'hammer',
      message: 'Do you want to install HammerJS ? 🔨 ',
      default: true,
    },
  ]);
  let angularNewCommand = `ng new ${answers.name}`;
  if (answers.routing) angularNewCommand += ` --routing=true`;
  if (!answers.testing) angularNewCommand += ` --skipTests=true`;
  if (!answers.framework) {
    angularNewCommand += ` --style=scss`;
  } else {
    angularNewCommand += ` --style=${answers.framework}`;
  }

  if (answers.version === 'latest') {
    printMsg('Updating Angular-CLI...');
    cp.execSync(`npm install -g @angular/cli@latest > ${toNull}`);
    printDone('Updating Angular-CLI...');
    printMsg('Creating the Angular App ...');
    cp.execSync(`${angularNewCommand} > ${toNull}`);
  } else {
    printMsg('Installing NPX...');
    cp.execSync(`npm install -g npx > ${toNull}`);
    printDone('Installing NPX...');
    printMsg('Creating the Angular App ...');
    cp.execSync(
      `npx -p @angular/cli@${answers.version} ${angularNewCommand} > ${toNull}`,
    );
  }
  printDone('Creating the Angular App ...');
  process.chdir(path.join(__dirname, answers.name));

  if (answers.themeFrame === 'Bootstrap') {
    printMsg('Installing Bootstrap...');
    cp.execSync(`npm install bootstrap > ${toNull}`);
    cp.execSync(`ng add ngx-bootstrap > ${toNull}`);
    printDone('Installing Bootstrap...');

    if (answers.themRes) {
      printMsg('Installing Bootswatch...');
      cp.execSync(`npm install bootswatch > ${toNull}`);
      fs.writeFileSync(
        'src/styles.scss',
        `@import "~bootswatch/dist/${theme}/variables";`,
      );
      fs.appendFileSync(
        'src/styles.scss',
        `@import "~bootstrap/scss/bootstrap";`,
      );
      fs.appendFileSync(
        'src/styles.scss',
        `@import "~bootswatch/dist/${theme}/bootswatch";`,
      );
      printDone('Installing Bootswatch...');
    }
  }

  if (answers.themeFrame === 'Material') {
    printMsg('Installing Material...');
    cp.execSync(`ng add @angular/material  > ${toNull}`);
    printDone('Installing Material...');

    if (answers.materialTheme !== 'custom') {
      printMsg('Adding Material Theme...');
      prependFile(
        'src/styles.scss',
        `@import '@angular/material/prebuilt-themes/${answers.materialTheme}.css';`,
      );
      printDone('Adding Material Theme...');
    }
  }

  if (answers.themeFrame === 'MDB') {
    printMsg('Installing Material for Bootstrap...');
    cp.execSync('ng add angular-bootstrap-md');
    printDone('Installing Material for Bootstrap...');
  }

  if (answers.fontAwesome) {
    printMsg('Installing Font Awesome...');
    cp.execSync(`npm install font-awesome > ${toNull}`);
    fs.readFile('angular.json', (_, data) => {
      data = JSON.parse(data);
      data.projects.recettes.architect.build.options.styles.push(
        './node_modules/font-awesome/scss/font-awesome.scss"',
      );
      data.projects.recettes.architect.test.options.styles.push(
        './node_modules/font-awesome/scss/font-awesome.scss"',
      );
      fs.writeFile('angular.json', JSON.stringify(data, null, 2));
    });
    printDone('Installing Font Awesome...');
  }

  if (answers.testFrame) {
    printMsg('Removing Karma and Jasmine...');
    cp.execSync(
      `npm uninstall karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter @types/jasmine @types/jasminewd2 jasmine-core jasmine-spec-reporter protractor > ${toNull}`,
    );
    printDone('Removing Karma and Jasmine...');
    printMsg('Installing Jest...');
    cp.execSync(`npm install jest jest-preset-angular @types/jest > ${toNull}`);
    printDone('Installing Jest...');
    printMsg('Configuring Jest...');
    const obj = {
      preset: 'jest-preset-angular',
      setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
      setupFiles: ['jest-canvas-mock'],
      coverageReporters: ['text', 'html'],
      coveragePathIgnorePatterns: ['/node_modules/'],
      transformIgnorePatterns: ['node_modules/(?!(ng2-charts-x)/)'],
    };
    fs.writeFile(
      'jest.config.ts',
      `module.exports = ${JSON.stringify(obj, null, 2)}`,
    );
    fs.readFile('package.json', (_, data) => {
      data = JSON.parse(data);
      data.scripts.test = 'jest --coverage';
      data.scripts['test:w'] = 'jest --coverage --watch';
      data.jest = {
        preset: 'jest-preset-angular',
        setupTestFrameworkScriptFile: '<rootDir>/src/setupJest.ts',
        testPathIgnorePatterns: [
          '<rootDir>/node_modules/',
          '<rootDir>/dist',
          '<rootDir>/src/test.ts',
        ],
      };
      fs.writeFile('package.json', JSON.stringify(data, null, 2));
    });
    fs.unlink('karma.conf.js', (_, __) => {});
    fs.unlink('src/test.js', (_, __) => {});
    rimraf('e2e');
    fs.readFile('angular.json', (_, data) => {
      data = JSON.parse(data);
      delete data.test;
      fs.writeFile('angular.json', JSON.stringify(data, null, 2));
    });
    fs.readFile('tsconfig.spec.json', (_, data) => {
      data = JSON.parse(data);
      data.types = ['node'];
      data.files = ['polyfills.ts'];
      fs.writeFile('tsconfig.spec.json', JSON.stringify(data, null, 2));
    });
    printDone('Configuring Jest...');
  }

  if (answers.hammer) {
    printMsg('Installing HammerJS...');
    cp.execSync(`npm install hammerjs > ${toNull}`);
    prependFile('src/main.ts', "import 'hammerjs';", () => {});
    printDone('Installing HammerJS...');
  }

  printMsg('Configuring TSLint...');
  fs.readFile('tslint.json', (_, data) => {
    data = JSON.parse(datadata.toString());
    data.projects.recettes.architect.build.options.styles.push(
      './node_modules/font-awesome/scss/font-awesome.scss"',
    );
    fs.writeFile('tslint.json', JSON.stringify(data, null, 2));
  });
  // fs.readFile('./src/tslint.json', (_, data) => {
  //   console.log(_);
  //   data = JSON.parse(data);
  //   data = tslintSrc;
  //   fs.writeFile('src/tslint.json', JSON.stringify(data, null, 2));
  // });
  printDone('Configuring TSLint...');

  process.stdout.write(
    `Done in ${Math.round((Date.now() - startTime) / 1000) / 60} mins`,
  );
})();

function printMsg(str) {
  process.stdout.write('🔲 ' + ' - ' + clk.blue(str));
}

function printDone(str) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write('✅ ' + ' - ' + clk.green(str) + '\n');
}
