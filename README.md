# Price Messenger

Price Messenger 是一个加密代币价格监测和提醒助手，在 node.js 环境中运行。

你可以设置需要监控的代币价格及其上限和下限，程序运行时会定时从链上预言机中获取这些代币的实时价格，当价格高于上限或低于下限时会自动向设置的邮箱发送提醒邮件。

这个小助手虽然简单，但它有两个无法忽视的优点，一是**私密性好**，二是**定制自由**！

## 使用说明

你可以在一个长期开机的电脑上运行这个小助手，也可以像我一样找一个便宜到家的云服务器来运行（我用的是宇宙中最超值的 [阿里云“99计划”](https://www.aliyun.com/daily-act/ecs/activity_selection?userCode=fqhhf0m3) 云服务器）。

下面说明以阿里云服务器为例。

### 1. 配置服务器

服务器开通好以后：地域选择一个离你比较近的；操作系统选择 ubuntu 20.04；登录方式建议选择自定义密码（高阶用户请随意），并设置好登录密码；其他选项保持默认即可。然后，静待服务器启动成功。

通过本地终端登录你的服务器：

``` bash
ssh root@xx.xx.xx.xx # xx.xx.xx.xx 是你的服务器公网 IP 地址
```

输入登录密码，进入服务器。

### 2. 配置环境

``` bash
# 安装 nvm (Node 版本管理器)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# 下载并安装 Node.js，强烈建议使用 v18 版本
nvm install 18

# 验证 Node.js 版本是否正确
node -v # 应该输出 `v18.20.5`

# 验证 npm 版本是否正确
npm -v # 应该输出 `10.8.2`
```

以上任何一步，如果出现找不到命令之类的错误，请输入以下命令让新添加的环境变量生效，然后再继续。

``` bash
source ~/.bashrc
```

友情提示：如果这个服务器还要同时执行别的项目或任务，建议使用 screen 工具为 Price Messenger 单独建立一个运行窗口，screen 用法请自行搜索。

### 3. 安装和配置我们的主角: Price Messenger

``` bash
# 拷贝源代码
git clone https://github.com/hibbb/price-messenger.git && cd price-messenger

# 用 nano 编辑器打开 configs.js 文件，并按照提示配置必要的参数
nano configs.js
```

修改好以后，按 `ctrl + x` 保存并退出编辑。

``` bash
# 安装依赖
npm install

# 运行程序
npm run start
```

## 其他

关于 Price Messenger 的任何问题，欢迎 [在此交流](https://github.com/hibbb/price-messenger/issues)。
