const chalk = require('chalk')

const messageBox = {
    info(text) {
        console.log('')
        console.log(chalk.whiteBright(`- ${text}`))
        console.log(chalk.whiteBright('--------------------------------------------------'))
      
        return Promise.resolve()
    },
    success(text) {
        console.log('')
        console.log(chalk.greenBright(`>> ${text}`))
        console.log(chalk.greenBright('--------------------------------------------------'))
      
        return Promise.resolve()
    },
    error(text) {
        console.log('')
        console.log(chalk.redBright(`>> Error: ${text}`))
        console.log(chalk.redBright('--------------------------------------------------'))
      
        return Promise.reject()
    }
}

module.exports = {
    messageBox
}