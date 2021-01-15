const path = require('path')
const fs = require('fs')
const { clone } = require('dl-files')
const ejs = require('ejs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')

const spinner = ora()
spinner.color = 'green'
const { messageBox } = require('./tools')
const cwd = process.cwd()
let prompts = [
    {
        type: 'input',
        name: 'description',
        message: `请输入项目描述 <例：IDS 鉴权中心>：`,
        validate(val) {
            if (!val) return chalk.red('请输入项目描述')
            else return true
        }
    }
]
/**
 * EJSDATA: 存储ejs上下文参数
 */
let EJSDATA = {}

// 插入 JSON 配置项
const insertConfig = () => {
    messageBox.info('写入 JSON 配置项')
    spinner.text = '正在写入 JSON 配置项';
    spinner.start()
    return new Promise(resolve => {
        Reflect.set(projectJson, EJSDATA.projectName, handleConfig.handlePro(EJSDATA))
        
        fs.writeFile(
            handleConfig.proJsonPath,
            JSON.stringify(projectJson, null, '\t'),
            (err, res) => {
                if (err) throw err
                setTimeout(resolve, 1000)
            })
    })
        .then(() => {
            spinner.succeed('成功写入 JSON 项目配置项')
        })
}

// 模板初始化 --- 复制项目模板
const initTemp = () => {
    messageBox.info('初始化项目模板')
    // const dirs = fs.readdirSync(handleConfig.tempPath)
  
    return clone({
        input: handleConfig.tempPath,
        output: path.join(cwd, handleConfig.basePath),
        fileName: EJSDATA.projectName,
        handleCopy(input, output) {
            spinner.start()
            return new Promise(resolve => {
                // 通过模板引擎读取文件内容，并写入上下文
                ejs.renderFile(input, EJSDATA, (err, result) => {
                    if (err) throw err
                    // 生成文件
                    fs.writeFileSync(output, result)
                    spinner.succeed(' -- ' + input)
                    resolve()
                })
            })
        }
    })
}

module.exports = projectName => {
    const { handleConfig, projectJson } = global

    prompts = prompts.concat(handleConfig.prompts)
    EJSDATA.projectName = projectName 
    inquirer
        .prompt(prompts)
        .then(answer => {
            EJSDATA = Object.assign(EJSDATA, answer)
        })
        .then(insertConfig)
        .then(initTemp)
        .then(() => {
            messageBox.success('项目模板已成初始化')
            handleConfig.handleAfterInit && handleConfig.handleAfterInit(EJSDATA)
        })
        .catch(err => {
            if (err) console.log(err)
        })
}
