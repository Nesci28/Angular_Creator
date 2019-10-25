while [[ -z ${project} ]]; do
  read -p "Project Name? (non alpha chracter will be stripped): " project
  project=$(echo "${project}" | sed 's/[^a-zA-Z]//g')
  if [[ ${project} == 'test' ]]; then
    echo -e "Project can't be named 'Test'"
    project=''
  fi
done
read -p "Do you want Routing? [Y/n]: " routing
if [[ -z ${routing} || ${routing} == 'Y' || ${routing} == 'y' ]]; then
  routing="--routing=true"
else
  routing=""
fi
read -p "Do you want Testing? [Y/n]: " testing
if [[ -z ${testing} || ${testing} == 'Y' || ${testing} == 'y' ]]; then
  testing=""
else
  testing="--skipTests=true"
fi

read -p "Font Awesome icons? [Y/n]: " fontAwesome

read -p "Bootswatch Theme? [Y/n]: " themeRes
if [[ -z ${themeRes} || ${themeRes} == 'Y' || ${themeRes} == 'y' ]]; then
  themeNames=("cerulean, cosmo, cyborg, darly, flatly, journal, litera, lumen, lux, materia, minty, pulse, sandstone, simplex, sketchy, slate, solar, spacelab, superhero, united, yeti")
  echo -e "Cerulean - A calm blue sky"
  echo -e "Cosmo - An ode to Metro"
  echo -e "Cyborg - Jet black and electric blue"
  echo -e "Darly - Flatly in night mode"
  echo -e "Flatly - Flat and modern"
  echo -e "Journal - Crisp like a new shoot of paper"
  echo -e "Litera - The mdeium is the message"
  echo -e "Lumen - Light and shadow"
  echo -e "Lux - A touch of class"
  echo -e "Materia - Material is the metaphor"
  echo -e "Minty - A fresh feel"
  echo -e "Pulse - A trace of purple"
  echo -e "Sandstone - A touch of warmth"
  echo -e "Simplex - Mini and minimalist"
  echo -e "Sketchy - A hand-drawn look for mockups and mirth"
  echo -e "Slate - Shades of gunmetal gray"
  echo -e "Solar - A spin on Solarized"
  echo -e "Spacelab - Silvery and sleek"
  echo -e "Superhero - The brave and the blue"
  echo -e "United - Ubuntu orange and unique font"
  echo -e "Yeti - A friendly foundation"
  while [[ -z ${theme} || ! "${themeNames[@]}" =~ "${theme}" ]]; do
    read -p "Bootswatch Theme Name?: " theme
    theme=$(echo ${theme} | tr '[:upper:]' '[:lower:]')
  done
fi
if [[ ! -z ${themeRes} && ${themeRes} != 'Y' && ${themeRes} != 'y' || ! -z ${fontAwesome} && ${fontAwesome} != 'Y' && ${fontAwesome} != 'y' ]]; then
  frameworkNames=("css", "scss", "sass", "less", "styl")
  while [[ -z ${framework} || ! "${frameworkNames[@]}" =~ "${framework}" ]]; do
    read -p "Which CSS framework? [SCSS, css, sass, less, styl]: " framework
    framework=$(echo ${framework} | tr '[:upper:]' '[:lower:]')
  done
  framework="--style=${framework}"
else
  framework="--style=scss"
fi

echo -e "Updating angular-CLI..."
npm install -g @angular/cli@latest > /dev/null 2>&1

echo -e "Creating the Angular App ${project}... Please, be patient, it might take a while."
ng new ${project} ${framework} ${routing} ${testing} > /dev/null 2>&1
cd ${project}

echo -e "Installing Bootstrap..."
npm install bootstrap > /dev/null 2>&1
ng add ngx-bootstrap > /dev/null 2>&1
if [[ ! -z ${theme} ]]; then
  echo -e "Installing Bootswatch..."
  npm install bootswatch > /dev/null 2>&1
  echo '@import "~bootswatch/dist/'${theme}'/variables";' > src/styles.scss
  echo '@import "~bootstrap/scss/bootstrap";' >> src/styles.scss
  echo '@import "~bootswatch/dist/'${theme}'/bootswatch";' >> src/styles.scss
fi
if [[ -z ${fontAwesome} || ${fontAwesome} == 'Y' || ${fontAwesome} == 'y' ]]; then
  echo -e "Installing Font Awesome..."
  npm install font-awesome > /dev/null 2>&1
  sed -i '0,/"styles": \[/s//"styles": \[\n\t\t\t\t\t\t\t"\.\/node_modules\/font-awesome\/scss\/font-awesome.scss",/' angular.json
fi

if [[ ${testing} == '--minimal=true' ]]; then
  echo -e "Removing Karma and Jasmine..."
  npm uninstall karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter @types/jasmine @types/jasminewd2 jasmine-core jasmine-spec-reporter protractor > /dev/null 2>&1
  echo -e "Installing Jest..."
  npm install jest jest-preset-angular @types/jest > /dev/null 2>&1
  echo -e "Configuring Jest..."
  touch jest.config.js
  echo -e "module.exports = {\n\tpreset: 'jest-preset-angular',\n\tsetupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],\n\tsetupFiles: ['jest-canvas-mock'],\n\tcoverageReporters: ['text', 'html'],\n\tcoveragePathIgnorePatterns: [\n\t\t'/node_modules/'\n\t],\n\ttransformIgnorePatterns: ['node_modules/(?"'!'"(ng2-charts-x)/)']\n};" > jest.config.js
  sed -i 's/"test": "ng test",/"test": "jest --coverage",\n\t\t"test:w": "jest --coverage --watch",/g' package.json
  sed -i '0,/\}/s//},\n\t"jest": \{\n\t\t"preset": "jest-preset-angular",\n\t\t"setupTestFrameworkScriptFile": "<rootDir>\/src\/setupJest.ts",\n\t\t"testPathIgnorePatterns": ["<rootDir>\/node_modules\/", "<rootDir>\/dist", "<rootDir>\/src\/test.ts"]\n\t}/' package.json
  rm karma.conf.js
  rm src/test.ts
  rm -r e2e
  sed -i '/\"types\"/,/]/ d; /^$/d' tsconfig.spec.json
  sed -i 's/"target": "es5",/"target": "es5",\n\t\t"types": ["node"],/' tsconfig.spec.json
  sed -i '/\"files\"/,/]/ d; /^$/d' tsconfig.spec.json
  sed -i 's/},/},\n\t"files": ["polyfills.ts"],/' tsconfig.spec.json
  sed -i '/\"test\"/,/},/ d; /^\$/d' angular.json
  touch src/setupJest.ts
  echo "import 'jest-preset-angular';" > src/setupJest.ts
fi

echo -e "Configuring lint..."
cp ../tslint.json tslint.json
cp ../tslint_src.json src/tslint.json