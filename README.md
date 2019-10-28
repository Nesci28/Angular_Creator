# Angular App

The shell version is not up to date with all the new options

### How to Use

```
npm install
node app.js
or
./angular_creator.sh
```

#### Manual Guide

- [ ] project=name_of_the_project
- [ ] routing=--routing=true
- [ ] testing=--skipTests=false
- [ ] framework=--style=scss
- [ ] theme=name_of_the_bootswatch_theme

#### Generate a new Angular App

- [ ] npm install -g @angular/cli@latest
- [ ] ng new \${project} \${routing} \${testing} \${framework}
- [ ] cd \${project}

#### Add Bootstrap/Bootswatch/Font-Awesome

- [ ] npm install bootstrap
- [ ] ng add ngx-bootstrap

#### Add Bootswatch/Font-Awesome (optional)

- [ ] npm install bootswatch font-awesome
- [ ] sed -i '0,/"styles": \[/s//"styles": \[\n\t\t\t\t\t\t\t"\.\/node_modules\/font-awesome\/scss\/font-awesome.scss",/' angular.json
- [ ] echo '@import "~bootswatch/dist/'\${theme}'/variables";' > src/styles.scss
- [ ] echo '@import "~bootstrap/scss/bootstrap";' >> src/styles.scss
- [ ] echo '@import "~bootswatch/dist/'\${theme}'/bootswatch";' >> src/styles.scss

#### Change Karma/Jasmine to Jest

- [ ] npm uninstall karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter @types/jasmine @types/jasminewd2 jasmine-core jasmine-spec-reporter protractor
- [ ] npm install jest jest-preset-angular @types/jest
- [ ] touch jest.config.js
- [ ] echo -e "module.exports = {\n\tpreset: 'jest-preset-angular',\n\tsetupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],\n\tsetupFiles: ['jest-canvas-mock'],\n\tcoverageReporters: ['text', 'html'],\n\tcoveragePathIgnorePatterns: [\n\t\t'/node_modules/'\n\t],\n\ttransformIgnorePatterns: ['node_modules/(?"'!'"(ng2-charts-x)/)']\n};" > jest.config.js
- [ ] sed -i 's/"test": "ng test",/"test": "jest --coverage",\n\t\t"test:w": "jest --coverage --watch",/g' package.json
- [ ] sed -i '0,/\}/s//},\n\t"jest": \{\n\t\t"preset": "jest-preset-angular",\n\t\t"setupTestFrameworkScriptFile": "<rootDir>\/src\/setupJest.ts",\n\t\t"testPathIgnorePatterns": ["<rootDir>\/node_modules\/", "<rootDir>\/dist", "<rootDir>\/src\/test.ts"]\n\t}/' package.json
- [ ] rm karma.conf.js
- [ ] rm src/test.ts
- [ ] rm -r e2e
- [ ] sed -i '/\"types\"/,/]/ d; /^\$/d' tsconfig.spec.json
- [ ] sed -i 's/"target": "es5",/"target": "es5",\n\t\t"types": ["node"],/' tsconfig.spec.json
- [ ] sed -i '/\"files\"/,/]/ d; /^\$/d' tsconfig.spec.json
- [ ] sed -i 's/},/},\n\t"files": ["polyfills.ts"],/' tsconfig.spec.json
- [ ] sed -i '/\"test\"/,/},/ d; /^\$/d' angular.json
- [ ] touch src/setupJest.ts
- [ ] echo "import 'jest-preset-angular';" > src/setupJest.ts

#### Lint

- [ ] cp ../tslint.json tslint.json
- [ ] cp ../tslint_src.json src/tslint.json

#### Guide

```html
To add an icon:
<i
  class="fa fa-american-sign-language-interpreting fa-5x"
  aria-hidden="true"
></i>
```

#### Todo

- [x] Angular Version picker
- [ ] Option to use Yarn instead of Npm
- [x] Option to add Material to the project
  - [x] Choose which theme
  - [ ] Help creating a Custom theme
- [x] Option to add Material Design for Bootstrap to the project
- [x] Option to add HammerJS
