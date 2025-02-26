# stock-kline-cli

一个在终端查看股票实时数据和K线图的命令行工具。

> 本项目是基于 [pstock](https://www.npmjs.com/package/pstock) 的改进版本。由于原项目未开源且不再维护，我们在保持原有ISC协议的基础上，重新实现并增加了更多功能。

## 特性

- 实时获取股票数据
- 支持日K和周K线图显示
- ASCII图表展示价格走势
- 支持多股票同时查看
- 可配置显示周期和图表样式
- AI智能分析功能
  - K线形态识别（锤子线、启明星等）
  - 趋势分析和交易建议
  - 自动生成分析报告

## 最新更新 (v1.0.1)

- 新增AI智能分析功能
  - K线形态自动识别
  - 趋势分析和强度评估
  - 智能交易建议
- 改进K线图显示效果
- 更多更新详见 [CHANGELOG.md](./CHANGELOG.md)

## 改进功能

- 支持日K和周K线图显示
- 可配置显示周期（默认20个周期）
- 可调整图表高度
- 支持多股票同时查看，并在K线图中显示股票名称
- ASCII图表展示价格走势
- AI智能分析，自动识别形态和趋势

## 安装

```bash
npm install -g stock-kline-cli
```

## 使用方法

### 基本用法

```bash
# 查看单个股票
stock-kline -s sh600000

# 查看多个股票
stock-kline -s sh600000,sz000001

# 显示日K线图
stock-kline -s sh600000 --day

# 显示周K线图
stock-kline -s sh600000 --week

# 同时显示日K和周K
stock-kline -s sh600000 --day --week
```

### 高级选项

```bash
# 设置显示周期数（默认20）
stock-kline -s sh600000 --day -p 60

# 设置图表高度（默认15）
stock-kline -s sh600000 --day -h 20

# 隐藏表头
stock-kline -s sh600000 -d

# 使用配置文件
stock-kline -c config.json
```

### 配置文件示例 (config.json)

```json
{
  "stocks": ["sh600000", "sz000001"]
}
```

## AI分析功能

工具会自动分析K线数据并提供以下信息：

1. **K线形态识别**
   - 锤子线：可能预示着下跌趋势即将结束
   - 启明星：强势反转信号，预示可能开始上涨

2. **趋势分析**
   - 基于MA5和MA10的趋势判断
   - 趋势强度评估（强势/弱势）
   - 自动生成交易建议

## 数据来源

- 实时数据：腾讯股票API
- K线数据：腾讯股票API

## 依赖要求

- Node.js >= 8.0.0

## 许可证

本项目遵循 ISC 协议，与原项目 [pstock](https://www.npmjs.com/package/pstock) 保持一致。

## 致谢

感谢原项目 [pstock](https://www.npmjs.com/package/pstock) 的创意和实现思路。