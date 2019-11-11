const cp = require('child_process');
const fs = require('fs');

const helpers = require('./helpers');

const rimraf = require('rimraf');

module.exports = async function(answers, toNull) {
  if (answers.testFrame) {
    helpers.printMsg('Removing Karma and Jasmine...');
    if (answers.yarn) {
      cp.execSync(
        `yarn remove karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter @types/jasmine @types/jasminewd2 jasmine-core jasmine-spec-reporter protractor > ${toNull}`,
      );
    } else {
      cp.execSync(
        `npm uninstall karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter @types/jasmine @types/jasminewd2 jasmine-core jasmine-spec-reporter protractor > ${toNull}`,
      );
    }
    helpers.printDone('Removing Karma and Jasmine...');
    helpers.printMsg('Installing Jest...');
    if (answers.yarn) {
      cp.execSync(
        `yarn add -D jest jest-preset-angular jest-canvas-mock @angular-builders/jest @types/jest > ${toNull}`,
      );
    } else {
      cp.execSync(
        `npm install --save-dev jest jest-preset-angular jest-canvas-mock @angular-builders/jest @types/jest > ${toNull}`,
      );
    }
    helpers.printDone('Installing Jest...');
    helpers.printMsg('Configuring Jest...');
    const obj = {
      preset: 'jest-preset-angular',
      setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
      setupFiles: ['jest-canvas-mock'],
      coverageReporters: ['text', 'html'],
      coveragePathIgnorePatterns: ['/node_modules/'],
      transformIgnorePatterns: ['node_modules/(?!(ng2-charts-x)/)'],
    };
    fs.writeFileSync(
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
      fs.writeFileSync('package.json', JSON.stringify(data, null, 2));
    });
    fs.unlink('karma.conf.js', (_, __) => {});
    fs.unlink('src/test.js', (_, __) => {});
    rimraf('e2e', _ => {});
    fs.readFile('angular.json', (_, data) => {
      data = JSON.parse(data);
      delete data.projects[answers.name].architect.test;
      delete data.projects[answers.name].architect.e2e;
      fs.writeFileSync('angular.json', JSON.stringify(data, null, 2));
    });
    helpers.printDone('Configuring Jest...');
  }
};
