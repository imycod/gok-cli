#! /usr/bin/env node

const program = require('commander') // 引入commander库
const shell = require('shelljs') // 引入shelljs库

async function loadInquier() {
    // commonjs 引入 esm 模块
    return await import("inquirer")
}


program.version('0.0.1') // 定义脚手架的版本号

async function useInquirer(params) {
    const inquirer = (await loadInquier()).default

    return await inquirer.prompt([
        {
            type: 'list', // 问题类型为列表选择
            ...params,
        }
    ])
}

program.command('create <projectName>') // 定义create命令，接收一个项目名称参数
    .description('create a new project') // 定义create命令的描述
    .action(async (projectName) => { // 定义create命令的执行逻辑
        // 使用inquirer提供交互式问题
        const answers = await useInquirer({
            name: 'template', // 问题名称为template
            message: 'Please choose a template', // 问题提示语
            choices: ['vue', 'react', 'angular'] // 问题选项
        })
        const { template } = answers // 解构出template答案
        if (template === 'vue') {
            const answersVersion = await useInquirer({
                name: 'version',
                message: 'Please choose a version', // 问题提示语
                choices: ['v2', 'v3'] // 问题选项
            })
            const { version } = answersVersion 
            switch (version) {
                case 'v2':
                    shell.exec(`git clone https://github.com/imycod/base-vue2-project.git`)
                    break;
                case 'v3':
                    // 选择构建平台
                    const tools = await useInquirer({
                        name: 'tool', 
                        message: 'Please choose a build tool', // 问题提示语
                        choices: ['vite', 'webpack'] // 问题选项
                    })
                    const { tool } = tools 
                    if (tool === 'vite') {
                        console.log('下载vite仓库 vue3');
                    }
                    if (tool === 'webpack') {
                        console.log('下载webpack仓库 vue3');
                    }
                    break;
                default:
                    break;
            }
        } else {
            console.log(`You choose ${template} template`) // 打印出用户选择的模板
            console.log(`Creating ${projectName} project...`) // 打印出正在创建项目的信息
            // 使用shelljs执行命令行操作，比如复制模板文件到指定目录
            shell.cp('-R', `../templates/${template}`, `./${projectName}`)
            console.log(`Project ${projectName} created successfully!`) // 打印出项目创建成功的信息
        }
    })

program.parse(process.argv) // 解析命令行参数