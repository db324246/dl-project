const fs = require('fs')
const path = require('path')
const { clean } = require('dl-files')
const ora = require('ora')

const spinner = ora()
const cwd = process.cwd()
const { messageBox } = require('./tools')

// 移除以有的项目模板
const removeProDir = projectName => {
    messageBox.info('移除项目模板')
    spinner.text = '正在移除'
    spinner.start()

    const target = path.join(cwd, handleConfig.basePath, projectName)
    return clean(target)
        .then(() => {
            spinner.succeed(` - ${target}`)
        })
}

// 移除 JSON 配置项
const removeConfig = projectName => {
    messageBox.info('移除 JSON 配置项')
    spinner.text = '正在移除 JSON 配置项'
    spinner.start()
    return new Promise((resolve, reject) => {
        Reflect.deleteProperty(projectJson, projectName)

        fs.writeFile(
            handleConfig.proJsonPath,
            JSON.stringify(projectJson, null, '\t'),
            (err, res) => {
                if (err) throw err
                setTimeout(resolve, 1000)
            })
    })
        .then(() => {
            spinner.succeed('成功移除 JSON 项目配置项')
        })
}
  
module.exports = projectName => {
    const { handleConfig, projectJson } = global

    removeConfig(projectName)
        .then(() => removeProDir(projectName))
        .then(() => {            
          messageBox.success('成初移除项目')
        })
}
