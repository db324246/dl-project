const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { clone , clean } = require('dl-files')
const ejs = require('ejs')
const { resolve } = require('path')

const cwd = process.cwd()
const command = process.argv[2]

/**
 * EJSDATA: 存储ejs上下文参数
 */
const EJSDATA = {} 

/**
 * handleConfig: 基础配置项
 */
let handleConfig = {
  proJsonPath: 'config/projectJson.json',
  basePath: 'src/projects',
  tempPath: path.join(__dirname, '../template'),
  prompts: [
    {
      name: 'authorName',
      message: '请输入开发人员名称：'
    },
  ],
  handlePro(data) {
    const projects = Object.values(projectJson).sort((a, b) => parseInt(b.port) - parseInt(a.port))
    const prot = projects.length ? parseInt(projects[0].port) + 1 : 2300;
    return {
      describtion: data.describtion,
      prefix: `'${data.projectName}'`,
      localPath: `./src/projects/${data.projectName}/`,
      port: prot.toString(),
      rootPath: `src/projects/${data.projectName}`
    }
  },
  messageBox(text) {
    console.log('')
    console.log('')
    console.log(`   ${text}`)
    console.log('--------------------------------------------------')
    console.log('')
  
    return Promise.resolve()
  }
}

/**
 * 项目 json 文件
 */
let projectJson = undefined

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
}

const quesForDescrib = () => {
  return new Promise(resolve => {
    rl.question('请输入项目描述 <例：IDS 鉴权中心>：', answer => {
      Reflect.set(EJSDATA, 'describtion', answer)
      resolve()
    })
  })
}

const quesForConfig = () => {
  if (handleConfig.prompts.length) {
    const ques = handleConfig.prompts.shift()
    return new Promise(resolve => {
      rl.question(ques.message, answer => {
        Reflect.set(EJSDATA, ques.name, answer)
        resolve()
        // if (handleConfig.prompt.length) return quesForConfig()
        // else resolve()
      })
    })
      .then(() => {
        if (handleConfig.prompts.length) return quesForConfig()
      })
  }
}

const valideName = projectName => {
  return Promise.resolve()
    .then(() => {
      Reflect.set(EJSDATA, 'projectName', projectName)

      if (!(/^[a-zA-Z]+$/.test(EJSDATA.projectName))) return handleConfig.messageBox('存在非法字符，请重新输入').then(quesForName).then(valideName)
      
      if (command === 'newPro' && projectJson.hasOwnProperty(EJSDATA.projectName)) return handleConfig.messageBox('项目已存在').then(quesForName).then(valideName)
    })
}

// 初始化配置项
const initConfig = projectName => {
  try {
    const config = require(path.join(cwd, 'build/dl-pro.conf.js'))
    handleConfig = Object.assign({}, handleConfig, config)
    
    projectJson = require(path.join(cwd, handleConfig.proJsonPath))
  } catch (error) {
    console.log(error)
  }
    
  return valideName(projectName)
}

// 模板初始化 --- 复制项目模板
const initTemp = () => {
  const dirs = fs.readdirSync(handleConfig.tempPath)

  return clone({
    input: handleConfig.tempPath,
    output: path.join(cwd, handleConfig.basePath),
    fileName: EJSDATA.projectName,
    handleCopy(input, output) {
      return new Promise(resolve => {
        // 通过模板引擎读取文件内容，并写入上下文
        ejs.renderFile(input, EJSDATA, (err, result) => {
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
const removeProDir = () => {
  return clean(path.join(cwd, handleConfig.basePath, EJSDATA.projectName))
}

// 插入 JSON 配置项
const insertConfig = () => {
  return new Promise(resolve => {
    
    Reflect.set(projectJson, EJSDATA.projectName, handleConfig.handlePro(EJSDATA))
    
    fs.writeFile(handleConfig.proJsonPath, JSON.stringify(projectJson), (err, res) => {
      if (err) throw err
      resolve()
    })
  })
}

// 移除 JSON 配置项
const removeConfig = () => {
  return new Promise((resolve, reject) => {
    Reflect.deleteProperty(projectJson, EJSDATA.projectName)

    fs.writeFile(handleConfig.proJsonPath, JSON.stringify(projectJson), (err, res) => {
      if (err) throw err
      resolve()
    })
  })
}

const newPro = projectName => {
  initConfig(projectName)
    .then(() => {
      return quesForDescrib()
    })
    .then(() => {
      return quesForConfig()
    })
    .then(() => {
      return insertConfig()
    })
    .then(() => {
      handleConfig.messageBox('成功插入 JSON 项目配置项')
      return initTemp()
    })
    .then(() => {
      handleConfig.messageBox('项目模板已成初始化')
      rl.close()
    })
}

const remove = projectName => {
  initConfig(projectName)
    .then(() => {
      return removeConfig()
    })
    .then(() => {
      handleConfig.messageBox('json 项目配置项成功移除')
      return removeProDir()
    })
    .then(() => {
      handleConfig.messageBox('成初移除项目')
      rl.close()
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = {
  quesForName,
  newPro,
  remove
}