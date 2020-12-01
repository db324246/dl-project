#!/usr/bin/env node
const handler = require('../lib/handler')

const command = process.argv[2]
let projectName = process.argv[3]

if (!projectName) {
  return handler.quesForName()
    .then(answer => {
      projectName = answer
      handler[command](projectName)
    })
}

handler[command](projectName)
