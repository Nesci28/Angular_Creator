# Angular App

Save hundred of thousands of hours (ok just kidding...) but some documentation research here and there and some time, for a tedious job which is creating a new Angular App with the necessary dependancies. This CLI tool will ask you the questions and generate an App depending on the answers.

```
to install: npm install -g angular-creator
command to run: ac || angular-creator
```

[![ex.png](https://i.postimg.cc/xdPgr6nR/ex.png)](https://postimg.cc/Mcv1VbcM)

#### Todo

- [x] Angular Version picker
      [ ] Limit with user's Node version
- [x] Option to use Yarn instead of Npm
- [x] Option to add Material to the project
  - [x] Choose which theme
  - [ ] Help creating a Custom Material theme
- [x] Option to add Material Design for Bootstrap to the project
- [x] Option to add HammerJS
- [x] Push to NPM
- [x] Option to create a new Git repo
  - [x] GitHub
  - [ ] Others.
- [x] Option to push to an existing Git repo
  - [x] Select Repo from APIs
- [ ] Save the user answers as default config (like npm init -y)
  - [ ] Automatically detects de config file
  - [ ] Take the config file as parameter (ag --config=config.json)
- [ ] Filter the result of the Repo List with an input (in case a user has a lot of repos)
