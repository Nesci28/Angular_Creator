const axios = require('axios');

module.exports = async function(answers, gitLink, toNull, gitName) {
  helpers.printMsg('Linking to git...');
  if (!answers.gitNew) {
    pushToRepo(gitLink, toNull);
  } else {
    if (answers.gitProvider === 'GitHub') {
      await axios.post(
        `https://api.github.com/user/repos`,
        {
          name: gitName,
        },
        {
          auth: {
            username: answers.gitUsername,
            password: answers.gitPassword,
          },
        },
      );
    }
    gitLink = `https://github.com/${answers.gitUsername}/${gitName}.git`;
    pushToRepo(gitLink, toNull);
  }
  helpers.printDone('Linking to git...');
};

function pushToRepo(gitLink, toNull) {
  cp.execSync(`git add . > ${toNull}`);
  cp.execSync(`git commit -m 'first commit' > ${toNull}`);
  cp.execSync(`git remote add origin ${gitLink} > ${toNull}`);
  cp.execSync(`git push -u origin master > ${toNull}`);
}
