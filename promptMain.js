const inquirer = require('inquirer');
inquirer.registerPrompt('directory', require('inquirer-select-directory'));
const cp = require('child_process');

module.exports = async function() {
  return await inquirer.prompt([
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
      type: 'confirm',
      name: 'yarn',
      message: 'Do you want to use Yarn instead of NPM ? 🧠 ',
      default: true,
      when: testForYarn(),
    },
    {
      type: 'text',
      name: 'name',
      message:
        'Project Name ? 🤔 ' + ' (non alpha characters will be stripped out)\n',
      filter: t => {
        return t.replace(/[^a-zA-Z-]/g, '');
      },
    },
    {
      type: 'directory',
      name: 'path',
      message:
        'Select the folder in which you want to create the project ? 📁\n',
      basePath: `${__dirname}`,
    },
    {
      type: 'confirm',
      name: 'routing',
      message: 'Do you want Routing ? 🚧 ',
      default: true,
    },
    {
      type: 'confirm',
      name: 'fontAwesome',
      message: 'Font Awesome icons ? ⛳ ',
      default: true,
    },
    {
      type: 'list',
      name: 'themeFrame',
      message: 'Which framework theme do you want ? ✒️ ',
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
      message: 'Bootswatch Theme ? 🎒 ',
      default: true,
      when: answers => {
        return answers.themeFrame === 'Bootstrap';
      },
    },
    {
      type: 'list',
      name: 'theme',
      message: 'Which Bootswatch Theme ? 📝 ',
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
      message: 'Do you want Testing ? ☢️ ',
      default: true,
    },
    {
      type: 'confirm',
      name: 'testFrame',
      message:
        'Do you want to use Jest instead of Karma/Jasmine/Protactor ? ⚙️ ',
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
    {
      type: 'confirm',
      name: 'git',
      message: 'Will you be using Git ? ☁️ ',
      default: false,
      when: testForGit(),
    },
    {
      type: 'list',
      name: 'gitProvider',
      message: 'Which Git provider do you use ? 🏆 ',
      choices: ['GitHub', 'GitLab', 'BitBucket', 'Local'],
      default: 'GitHub',
      when: answers => {
        return answers.git;
      },
    },
    {
      type: 'directory',
      name: 'gitPath',
      message: 'Select the folder in which is your ".git" 🔗 ',
      basePath: `${__dirname}`,
      when: answers => {
        return answers.git && answers.gitProvider === 'Local';
      },
    },
    {
      type: 'confirm',
      name: 'gitNew',
      message: 'Are you creating a new repo ? ✨ ',
      default: true,
      when: answers => {
        return answers.gitProvider === 'GitHub';
      },
    },
    {
      type: 'text',
      name: 'gitUsername',
      message: 'What is your Username on your Git provider ? 📛 ',
      when: answers => {
        return answers.git && answers.gitProvider !== 'Local';
      },
    },
    {
      type: 'password',
      name: 'gitPassword',
      message:
        'What is your Password on your Git provider ? 🔑 ' +
        ' (password is necessary to create a new Repo)',
      when: answers => {
        return answers.git && answers.gitProvider !== 'Local' && answers.gitNew;
      },
    },
  ]);
};

function testForYarn() {
  try {
    cp.execSync('yarn --version').toString();
    return true;
  } catch {
    return false;
  }
}

function testForGit() {
  try {
    cp.execSync('git --version').toString();
    return true;
  } catch {
    return false;
  }
}
