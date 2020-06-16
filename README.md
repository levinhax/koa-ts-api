# koa-ts-api
Koa TypeScript API width MySQL

自己项目中使用到的服务示例

### 使用

Run the project directly in TS
```
npm run watch-server
```

Build and run the project in JS
```
npm run build-server

// 启动后端项目: pm2 start dist/src/index.js --watch -i 2
```

### 目录

```
koa-ts-api
├─ .eslintrc.js            // eslint配置
├─ .prettierrc             // prettierrc配置
├─ .huskyrc                // 钩子Husky
├─ commitlint.config.js    // commitlint配置
├─ ormconfig.js            // typeorm数据库配置
├─ package.json            // 项目配置
├─ src
│    ├─ controller         // 业务逻辑
│    ├─ entity             // 数据库模型
│    ├─ index.ts           // 入口
│    ├─ middlewares        // 中间件
│    ├─ routes             // 路由
│    ├─ types              // 数据的类型
│    └─ utils              // 常用工具
└─ tsconfig.json
```

### 快速构建一个项目

```
mkdir galaxy-server

npm init   // 生成package.json文件

npm install koa --save

npm install --save-dev typescript @types/koa
```

生成tsc配置文件(tsconfig.json):

```
tsc --init
```

在node中采用CommonJS 模块规范，而我们使用TypeScript之后，将会使用es6的import进行模块的导入导出，而typescript文件最终编译回javascript文件的时候，需要将这部分代码转换成CommonJS规范，否则项目出错，所以module选项应为commonjs

### 代码规范

1. eslint结合prettier规范代码并格式化

- 在编辑器中安装eslint和prettier插件
- 在项目中安装相关包，包的内容包含eslint、prettier、esling-typescript插件以及eslint-prettier插件等

```
npm install --save-dev eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-prettier  @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier
```

*我们使用airbnb的标准代码格式规范，业内比较常用的就是airbnb和standard这两个规范*

- eslint-config-airbnb: airbnb是我们主要的代码检测规则
- eslint-config-prettier: 解决eslint和prettier对于同一个错误多次报错的问题
- eslint-plugin-prettier: 让eslint调用prettier对你的代码风格进行检查

- 在根目录下新建 .eslintrc.js 文件
- 根目录添加 .prettierrc 文件，用作该项目的prettierrc格式化配置

*.prettierrc和.eslintrc.js配置中，如果module出现了警告，在在根目录新建.eslintignore，在该文件里面把 .eslintrc.js和.prettierrc文件添加为检测对象即可*

```
// .eslintignore

!.prettierrc    // ! 是添加进检测的意思
```

2. 使用husky做pre-commit

- 添加一个命令到package.json中去，用作代码格式检测

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint src --ext .ts,.tsx"
  },
````

- 添加pre-commit

我们使用husky这个库来为我们添加pre-commit功能: npm install husky --save-dev

```
// package.json

"husky": {
    "hooks": {
      "pre-commit": "npm run lint"
    }
},
```
这里直接使用了.huskyrc配置文件

- 使用commitlint规范git提交信息

```
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

在根目录新建一个 commitlint.config.js 文件，用作自定义一些commit提交规则，当然这一步也可以不做，直接使用常规校验也行

```
// commitlint.config.js

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
}
```

在之前的husky配置中，把commitlint的校验命令添加进去:
```
"husky": {
    "hooks": {
      "pre-commit": "npm run lint",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
},
```

### 编写并启动文件

```
src/index.ts

const Koa = require('koa')
const app = new Koa()

import { Context } from 'koa'

app.use(async (ctx: Context) => {
    ctx.body = 'Hello World'
})

app.listen(5000, () => {
    console.log(`Server is running on port 5000`)
})
```

### 开发热更新

方法1. ts-node-dev

```
npm install --save-dev ts-node-dev cross-env
```

```
"scripts": {
  "watch-server": "cross-env NODE_ENV=development ts-node-dev --inspect -- src/index.ts",
}
```

方法2. nodemon实现Typescript项目热更新

- ts-node: 直接运行ts项目
- nodemon: 监听文件改变自动重启Node Server服务的工具

```
"scripts": {
  "start": "nodemon -e ts,tsx --exec ts-node src/index.ts"
}
```

上述参数是设置在命令行中的，也可以在nodemon.json中设置
```
"scripts": {
  "start": "nodemon src/index.ts"
}
```

```
// nodemon.json

{
    "restartable": "rs",
    "verbose": true,
    "execMap": {
        "ts": "ts-node"
    },
    "ignore": ["**/*.test.ts", ".git", "node_modules"],
    "watch": ["src"],
    "env": {
        "TS_NODE_FILES": "true",
        "TS_NODE_PROJECT": "./tsconfig.json",
        "APP_ENV": "dev",
        "NODE_ENV": "qa",
        "DBNAME": "galaxy",
        "DBACCOUNT": "root",
        "DBPASSWORD": "pass123456"
    },
    "ext": "js,json,ts"
}
```

### 使用pm2跑后端项目

```
  "scripts": {
    "watch-server": "cross-env NODE_ENV=development ts-node-dev --inspect -- src/index.ts",
    "build-server": "tsc",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint src --ext .ts,.tsx"
  },
```

pm2是node进程管理工具，可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单

安装并使用pm2: npm install -g pm2

启动后端项目: pm2 start dist/src/index.js --watch -i 2

访问: http://localhost:5000/

### 静态资源目录

使用koa-static中间件，只需简单几步就可以搭建一个静态服务器，让我们获取到项目中的图片等静态资源。

```
npm install --save koa-static
npm install --save-dev @types/koa-static
```

```
// 配置静态web服务的中间件
import koaStatic from 'koa-static';
const path = require('path');

// app.use(koaStatic(__dirname + '/static/'));
app.use(koaStatic(path.join(__dirname + '/static/')));
```

### 跨域

```
npm install --save koa2-cors
npm install --save-dev @types/koa2-cors
```

### 获取请求参数

```
npm install --save koa-bodyparser
npm install --save-dev @types/koa-bodyparser
```

打印 ctx.request对象发现可以获取到传的参数

### 连接数据库

*请确保数据库已安装*

typeorm、mysql中间件

```
npm install typeorm --save
npm install mysql --save
```

在项目根目录新建 ormconfig.json 文件，用于写typeorm 数据库的相关配置(你还可以在现有 node 项目上运行 typeorm init，但要注意，此操作可能会覆盖已有的某些文件)。然后进入 src/index.ts 文件， 从typeorm中引入并使用createConnection方法。最后还需要去创建entity。

报错 "Client does not support authentication protocol requested by server; consider upgrading MySQL client
": TypeORM的自动建表功能无法在root用户下进行，新建用户.
