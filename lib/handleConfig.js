const path = require('path')

/**
 * handleConfig: 基础配置项
 */
module.exports = {
  /**
   * /^[a-zA-Z]+$/  校验英文字母
   * /^[a-zA-Z_-]+$/ 校验英文字母、下划线、建号 
   * /^[a-zA-Z0-9_-]+$/ 校验英文字母、数字、下划线、建号 
   * /^[a-zA-Z0-9_-]{8,16}$/ 校验英文字母、数字、下划线、建号，长度为 8-16位
   */
  projectNameTest: /^[a-zA-Z_-]+$/,
  proJsonPath: 'config/projectJson.json',
  basePath: 'src/projects',
  tempPath: path.join(__dirname, '../template'),
  prompts: [
    {
      type: 'input',
      name: 'authorName',
      message: '请输入开发人员名称：'
    },
    {
      type: 'list',
      name: 'type',
      message: '请输入下载方式：',
      choices: ['npm', 'yarn', 'cnpm'],
      default: 2 // 指定默认值 为选项索引号
    },
    {
      type: 'checkbox', // 多选题 返回一个数组
      name: 'dependencies',
      message: '请输入项目依赖：',
      choices: ['npm', 'yarn', 'cnpm']
    },
    {
      type: 'confirm', // 判断题 返回一个布尔值
      name: 'isAlone',
      message: '是否独立开发：'
    },
    {
      type: 'confirm',
      message: '是否在创建项目后直接运行新项目：',
      name: 'runPro'
    }
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
  }
  // handleAfterInit(data) {
  //   console.log('操作结束', data)
  // }
}