### dl-project 脚手架

> 微研产品版项目模板脚手架
> 可以在项目 build/dl-pro.conf.js 文件中对脚手架进行配置

#### 脚手架的基础默认配置

``` javascript
  /**
   * handleConfig: 基础配置项
   */
  let handleConfig = {
    proJsonPath: 'config/projectJson.json', // json 文件路径
    basePath: 'src/projects', // 输出的文件路径
    tempPath: path.join(__dirname, '../template'), // 模板路径
    prompts: [ // 交互数组
      {
        name: 'authorName', 
        required: true, // 是否必填
        message: '请输入开发人员名称：'
      },
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
    messageBox(text) { // cmd 提示语样式
      console.log('')
      console.log('')
      console.log(`   ${text}`)
      console.log('--------------------------------------------------')
      console.log('')
    
      return Promise.resolve()
    }
  }
```

#### 版本记录

| 版本号 | 时间 | 内容 |
| --- | --- | --- | 
| 1.1.4 | 2020.12.2 | 增加配置项问题交互是否必填的字段 |
| 1.1.2 | 2020.12.2 | 可配置项 bug 修复 |
| 1.1.0 | 2020.12.2 | 增加可配置项 |
| 1.0.0 | 2020.12.1 | 测试版 |
