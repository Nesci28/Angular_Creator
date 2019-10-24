# Angular App

- [ ] project=name_of_the_project

#### Generate a new Angular App

- [ ] npm install -g @angular/cli@latest
- [ ] ng add \${project}

#### Add Bootstrap

- [ ] npm install bootstrap
- [ ] cd \${project}
- [ ] sed -i '0,/"styles": \[/s//"styles": \[\n\t\t\t\t\t\t\t"node_modules\/bootstrap\/dist\/css\/bootstrap.min.css"\,/' angular.json
- [ ] ng add ngx-bootstrap

#### Add Bootswatch (optional)

- [ ] theme=name_of_the_bootswatch_theme
- [ ] sed -i 's/<\/head>/\t<link rel="stylesheet" href="https:\/\/bootswatch.com\/4\/'${theme}'\/bootstrap.min.css">\n<\/head>/g' src/index.html

#### Change Karma/Jasmine to Jest

- [ ] npm uninstall karma jasmine
- [ ] npm install jest
- [ ] touch jest.config.js
- [ ] echo -e "module.exports = {\n\tpreset: 'jest-preset-angular',\n\tsetupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],\n\tsetupFiles: ['jest-canvas-mock'],\n\tcoverageReporters: ['text', 'html'],\n\tcoveragePathIgnorePatterns: [\n\t\t'/node_modules/'\n\t],\n\ttransformIgnorePatterns: ['node_modules/(?"'!'"(ng2-charts-x)/)']\n};" > jest.config.js
- [ ] sed -i 's/"test": "ng test",/"test": "jest --coverage",\n\t\t"test:w": "jest --coverage --watch",/g' package.json
- [ ] rm karma.conf.js
- [ ] sed -i '/\"test\"/,/},/ d; /^\$/d' 1.a
- [ ] touch src/setupJest.ts
- [ ] echo "import 'jest-preset-angular';" > src/setupJest.ts
