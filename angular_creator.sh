!#/bin/bash

read -p "Project Name?: " project
read -p "Bootswatch Theme? [Y/n]: " themeRes
if [[ -z ${themeRes} || ${themeRes} == 'Y' || ${themeRes} == 'y' ]]; then
  while [[ -z ${theme} ]]; do
    read -p "Bootswatch Theme Name?: " theme
  done
fi

echo -e "Updating angular-CLI..."
npm install -g @angular/cli@latest > /dev/null 2>&1

echo -e "Creating the Angular App ${project}... Please, be patient, it might take a while."
ng add ${project} > /dev/null 2>&1

echo -e "Adding Bootstrap..."
npm install bootstrap
cd ${project}
sed -i '0,/"styles": [/s//"styles": [\n\t\t\t\t\t\t\t"node_modules/bootstrap/dist/css/bootstrap.min.css",/' angular.json
ng add ngx-bootstrap

echo -e "Removing Karma and Jasmine from the ${project}..."
npm uninstall karma jasmine > /dev/null 2>&1
echo -e "Installing Jest..."
npm install jest > /dev/null 2>&1
echo -e "Configuring Jest..."
touch jest.config.js
echo -e "module.exports = {\n\tpreset: 'jest-preset-angular',\n\tsetupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],\n\tsetupFiles: ['jest-canvas-mock'],\n\tcoverageReporters: ['text', 'html'],\n\tcoveragePathIgnorePatterns: [\n\t\t'/node_modules/'\n\t],\n\ttransformIgnorePatterns: ['node_modules/(?"'!'"(ng2-charts-x)/)']\n};" > jest.config.js
sed -i 's/"test": "ng test",/"test": "jest --coverage",\n\t\t"test:w": "jest --coverage --watch",/g' package.json
rm karma.conf.js
sed -i '/\"test\"/,/},/ d; /^\$/d' 1.a
touch src/setupJest.ts
echo "import 'jest-preset-angular';" > src/setupJest.ts