### dl-project 脚手架

> 微研产品版项目模板脚手架
> 可以在项目 build/dl-pro.conf.js 文件中对脚手架进行配置

#### 脚手架的基础默认配置

``` javascript
  /**
   * handleConfig: 基础配置项
   */
  let handleConfig = {
    projectNameTest: /^[a-zA-Z_-]+$/, // 项目名称的校验规则
    proJsonPath: 'config/projectJson.json', // json 文件路径
    basePath: 'src/projects', // 输出的文件路径
    tempPath: path.join(__dirname, '../template'), // 模板路径
    prompts: [ // 交互数组
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
    handlePro(data) { // json 的配置对象
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
    handleAfterInit(data) { // 创建新项目的回调函数
      console.log('操作结束', data)
    }
  }
```

#### 版本记录

| 版本号 | 时间 | 内容 |
| --- | --- | --- | 
| 1.1.8 | 2020.12.10 | 脚手架命令添加 config 选项，可设置配置文件所在的路径。默认在项目根目录下 |
| 1.1.7 | 2020.12.7 | 导出配置 projectName 的校验规则，并修改默认的校验规则 |
| 1.1.6 | 2020.12.5 | 使用 inquirer，ora，commander 美化并重构脚手架 |
| 1.1.4 | 2020.12.2 | 增加配置项问题交互是否必填的字段 |
| 1.1.2 | 2020.12.2 | 可配置项 bug 修复 |
| 1.1.0 | 2020.12.2 | 增加可配置项 |
| 1.0.0 | 2020.12.1 | 测试版 |
