#!/usr/bin/env node
const { program } = require("commander")
const { version } = require('../package.json')

const commandObj = {
  'create <projectName>': {
    alias: 'crt',
    desc: 'create new project'
  },
  'remove <projectName>': {
    alias: 'rm',
    desc: 'remove project'
  }
}

Reflect.ownKeys(commandObj).forEach(command => {
  program
    .command(command)
    .alias(commandObj[command].alias)
    .description(commandObj[command].desc)
    .action((projectName) => {
      require('..')(projectName, command)
    });
})

program.version(`v ${version}`)
  .parse(process.argv);
