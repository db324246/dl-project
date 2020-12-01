const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { filesClone, emptyDir } = require('./dl-files')
const ejs = require('ejs')
const { resolve } = require('path')

const cwd = process.cwd()
const command = process.argv[2]

let handleConfig = {
  proJsonPath: 'config/projectJson.json',
  basePath: 'src/projects',
  handlePro(projectName, describtion) {
    const prot = parseInt(projectJson[projectJson.length - 1].port) + 1;
    return {
      key: projectName,
      projectName,
      describtion,
      prefix: `'${projectName}'`,
      localPath: `./src/projects/${projectName}/`,
      port: prot.toString(),
      rootPath: `src/projects/${projectName}`
    }
  },
  messageBox(text) {
    console.log('')
    console.log('')
    console.log('--------------------------------------------------')
    console.log(`              ${text}`)
    console.log('--------------------------------------------------')
    console.log('')
    console.log('')
  
    return Promise.resolve()
  }
}

try {
  const config = require(path.join(cwd, 'build/dl-project.conf.js'))
  handleConfig = Object.assign({}, handleConfig, config)
} catch (error) {
  // console.log(error)
}

const proJsonPath = path.join(cwd, handleConfig.proJsonPath)
const projectJson = require(proJsonPath)
const temp = path.join(__dirname, '../template')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on("close", function(){
  // 结束程序
  console.log('再见')
  process.exit(0)
})

const quesForName = () => {
  return new Promise(resolve => {
    rl.question('请输入项目名称 <例：IDS>：', answer => {
      resolve(answer)
    })
  })
    .then(answer => {
      if (!(/^[a-zA-Z]+$/.test(answer))) return handleConfig.messageBox('存在非法字符，请重新输入').then(quesForName)

      if (command === 'newPro' && projectJson.some(item => item.key === answer)) return handleConfig.messageBox('项目已存在').then(quesForName)
      
      return answer
    })
}

const quesForDescrib = () => {
  return new Promise(resolve => {
    rl.question('请输入项目描述 <例：IDS 鉴权中心>：', answer => {
      resolve(answer)
    })
  })
}

// 模板初始化 --- 复制项目模板
const initTemp = projectName => {
  const dirs = fs.readdirSync(temp)

  return filesClone({
      input: temp,
      output: path.join(cwd, handleConfig.basePath),
      fileName: projectName,
      handleCopy(input, output) {
        return new Promise(resolve => {
          // 通过模板引擎读取文件内容，并写入上下文
          ejs.renderFile(input, { projectName: projectName }, (err, result) => {
            if (err) throw err
            // 生成文件
            fs.writeFileSync(output, result)
            console.log(' | | ' + input)
            resolve()
          })
        })
      }
    })
}

// 移除以有的项目模板
const removeProDir = (projectName) => {
  return emptyDir(path.join(cwd, handleConfig.basePath, projectName))
}

// 插入 JSON 配置项
const insertConfig = (projectName, describtion) => {
  return new Promise(resolve => {
  
    projectJson.push(handleConfig.handlePro(projectName, describtion))
    
    fs.writeFile(proJsonPath, JSON.stringify(projectJson), (err, res) => {
      if (err) throw err
      resolve()
    })
  })
}

// 移除 JSON 配置项
const removeConfig = projectName => {
  return new Promise((resolve, reject) => {
    const index = projectJson.findIndex(item => item.key === projectName)
  
    if (index < 0) return resolve()

    projectJson.splice(index, 1)

    fs.writeFile(proJsonPath, JSON.stringify(projectJson), (err, res) => {
      if (err) throw err
      resolve()
    })
  })
}

const newPro = projectName => {
  quesForDescrib()
    .then(describtion => {
      return insertConfig(projectName, describtion)
    })
    .then(() => {
      handleConfig.messageBox('成功插入 JSON 项目配置项')
      return initTemp(projectName)
    })
    .then(() => {
      handleConfig.messageBox('项目模板已成初始化')
        .then(() => {
          rl.close()
        })
    })
}

const remove = projectName => {
  removeConfig(projectName)
    .finally(() => {
      handleConfig.messageBox('json 项目配置项成功移除')
        .then(() => {
          return removeProDir(projectName)
        })
        .then(() => {
          handleConfig.messageBox('成初移除项目')
            .then(() => {
              rl.close()
            })
        })
        .catch(err => {
          console.log(err)
        })
    })
}

module.exports = {
  quesForName,
  newPro,
  remove
}