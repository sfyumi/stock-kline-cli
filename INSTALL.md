# 安装指南 (Installation Guide)

## 系统要求

- Node.js >= 8.0.0
- npm (通常随 Node.js 一起安装)

## 检查 Node.js 版本

在安装之前，请确认您的系统已安装 Node.js：

```bash
node --version
npm --version
```

如果未安装 Node.js，请访问 [Node.js 官网](https://nodejs.org/) 下载并安装。

## 安装方式

### 方式一：全局安装（推荐）

全局安装后可以在任何目录下使用 `stock-kline` 命令：

```bash
npm install -g stock-kline-cli
```

安装完成后，验证安装：

```bash
stock-kline --version
stock-kline --help
```

### 方式二：本地安装

如果您只想在特定项目中使用：

```bash
npm install stock-kline-cli
```

本地安装后，使用 npx 运行：

```bash
npx stock-kline -s sh600000
```

### 方式三：从源码安装

1. 克隆仓库：

```bash
git clone https://github.com/sfyumi/stock-kline-cli.git
cd stock-kline-cli
```

2. 安装依赖：

```bash
npm install
```

3. 运行：

```bash
node index.js -s sh600000
```

或者链接到全局：

```bash
npm link
stock-kline -s sh600000
```

## 快速开始

安装完成后，尝试以下命令：

```bash
# 查看单个股票
stock-kline -s sh600000

# 查看多个股票
stock-kline -s sh600000,sz000001,hk00700

# 显示日K线图
stock-kline -s sh600000 --day

# 使用配置文件
stock-kline -c example-holdings.json --asset
```

## 配置资产追踪

1. 创建配置文件 `my-holdings.json`：

```json
{
  "holdings": {
    "sh600000": 1000,
    "sz000001": 500,
    "hk00700": 200
  }
}
```

2. 运行命令查看资产：

```bash
stock-kline -c my-holdings.json --asset
```

## 升级

### 全局安装的升级

```bash
npm update -g stock-kline-cli
```

### 本地安装的升级

```bash
npm update stock-kline-cli
```

## 卸载

### 全局卸载

```bash
npm uninstall -g stock-kline-cli
```

### 本地卸载

```bash
npm uninstall stock-kline-cli
```

## 常见问题

### 权限错误（Permission denied）

如果在全局安装时遇到权限错误：

**方法 1：使用 sudo（不推荐）**
```bash
sudo npm install -g stock-kline-cli
```

**方法 2：修改 npm 默认目录（推荐）**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g stock-kline-cli
```

### 网络问题

如果下载速度慢或失败，可以使用国内镜像：

```bash
npm install -g stock-kline-cli --registry=https://registry.npmmirror.com
```

### 找不到命令

如果安装后提示"command not found"：

1. 检查 npm 全局安装路径：
```bash
npm config get prefix
```

2. 确保该路径在 PATH 环境变量中：
```bash
echo $PATH
```

3. 如果不在，添加到 ~/.bashrc 或 ~/.zshrc：
```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

## 依赖项

本工具依赖以下 npm 包：

- axios: 网络请求
- commander: 命令行解析
- iconv-lite: 编码转换
- table: 表格显示
- asciichart: ASCII 图表
- chalk: 终端颜色

这些依赖会在安装时自动下载。

## 技术支持

如遇到问题，请访问：
- GitHub Issues: https://github.com/sfyumi/stock-kline-cli/issues

## 更新日志

查看最新功能和改进：
- 查看 README.md 中的"最新更新"部分
