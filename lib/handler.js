const path = require('path')
const { messageBox } = require('./tools')
let handleConfig = require('./handleConfig')

// 初始化配置项
const initConfig = (projectName, cmd) => {
  const cwd = process.cwd()
  try {
    const config = require(path.join(cwd, 'build/dl-pro.conf.js'))
    handleConfig = Object.assign({}, handleConfig, config)

    global.handleConfig = handleConfig
  } catch (error) {
    // console.log(error)
  }
    
  global.projectJson = require(path.join(cwd, handleConfig.proJsonPath))

  return valideName(projectName, cmd)
}

// 项目名称校验
const valideName = (projectName, command) => {
  const { projectJson } = global

  return Promise.resolve()
    .then(() => {
      if (!handleConfig.projectNameTest.test(projectName)) return messageBox.error('项目名称存在非法字符')

      if (command === 'create' && projectJson.hasOwnProperty(projectName)) return messageBox.error('项目已存在')
    })
}

module.exports = (projectName, command) => {
  const cmd = command.split(' ')[0]
  
  initConfig(projectName, cmd)
    .then(() => {
      require(`./${cmd}`)(projectName)
    })
    .catch(err => {
      if (err) console.log(err)
    })
}