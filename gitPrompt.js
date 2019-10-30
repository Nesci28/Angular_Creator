const inquirer = require('inquirer');
inquirer.registerPrompt('directory', require('inquirer-select-directory'));
const axios = require('axios');

module.exports = {
  gitHub: async username => {
    const gitPath = await inquirer.prompt([
      {
        type: 'list',
        name: 'gitPath',
        message: 'Select the repo you want to use 🔗 ',
        choices: await githubChoices(username),
      },
    ]);
    return `https://github.com/${username}/${gitPath.gitPath}.git`;
  },
  gitLab: async username => {
    const gitPath = await inquirer.prompt([
      {
        type: 'list',
        name: 'gitPath',
        message: 'Select the repo you want to use 🔗 ',
        choices: await gitlabChoices(username),
      },
    ]);
    return `https://gitLab.com/${username}/${gitPath.gitPath}.git`;
  },
  bitbucket: async username => {
    const gitPath = await inquirer.prompt([
      {
        type: 'list',
        name: 'gitPath',
        message: 'Select the repo you want to use 🔗 ',
        choices: bitbucketChoices(username),
      },
    ]);
    return `https://bitbucket.org/${username}/${gitPath.gitPath}.git`;
  },
};

async function githubChoices(username) {
  const res = await axios.get(`https://api.github.com/users/${username}/repos`);
  const repos = [];
  res.data.forEach(repo => repos.push(repo.name));
  return repos;
}

async function gitlabChoices(username) {
  const res = await axios.get(
    `https://gitlab.com/api/v4/users/${username}/projects`,
  );
  const repos = [];
  res.data.forEach(repo => repos.push(repo.name));
  return repos;
}

async function bitbucketChoices(username) {
  const res = await axios.get(
    `https://api.bitbucket.org/2.0/repositories/${username}`,
  );
  const repos = [];
  res.data.values.forEach(repo => repos.push(repo.name));
  return repos;
}
