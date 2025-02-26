#!/usr/bin/env node

const axios = require('axios');
const iconv = require('iconv-lite');
const { table } = require('table');
const fs = require('fs');
const { program } = require('commander');
const asciichart = require('asciichart');
const chalk = require('chalk');

const columns = ['名字', '代码', '当前股价', '今日涨跌幅', '昨日收盘价'];

const config = {
  showHead: true,
  defaultPeriod: 20 // 默认周期数
}

program
  .version('1.0.2', '-v, --version')
  .option('-c, --config <path>', '设置配置文件')
  .option('-d', '隐藏表头')
  .option('-s, --stock <list>', '设置stock代码, 多个以逗号隔开', (val) => val.split(','))
  .option('--day', '显示日K数据')
  .option('--week', '显示周K数据')
  .option('-p, --period <number>', '设置显示的周期数量，默认20', (val) => parseInt(val))
  .option('-h, --height <number>', '设置图表高度，默认15', (val) => parseInt(val))

program.parse();

const options = program.opts();
if (options.d) {
  config.showHead = false;
}

if (options.stock) {
  printStock(options.stock)
} else if (options.config) {
  const data = fs.readFileSync(options.config);
  const configData = JSON.parse(data);
  printStock(configData.stocks);
}

async function getKLineData(code, type = 'day') {
  try {
    const klineType = type === 'day' ? 'day' : 'week';
    const period = options.period || config.defaultPeriod;
    
    const response = await axios({
      method: 'get',
      url: `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},${klineType},,,${period * 2},qfq`,
      headers: {
        'Referer': 'http://web.ifzq.gtimg.cn/',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (response.data && response.data.data && response.data.data[code]) {
      const stockData = response.data.data[code];
      // 根据类型获取对应的数据
      let klineData;
      if (type === 'day') {
        klineData = stockData.qfqday || stockData.day;
      } else {
        klineData = stockData.qfqweek || stockData.week;
      }

      if (klineData && klineData.length > 0) {
        // 返回指定周期数量的数据
        return klineData.slice(-period).map(item => ({
          date: item[0],
          open: parseFloat(item[1]),
          close: parseFloat(item[2]),
          high: parseFloat(item[3]),
          low: parseFloat(item[4]),
          volume: parseInt(item[5]),
          price: parseFloat(item[2]) // 收盘价作为当前价格
        }));
      }
    }
    return [];
  } catch (error) {
    console.error(`获取${type}K数据失败:`, error.message);
    return [];
  }
}

function printKLineChart(klineData, type, stockName, code) {
  if (klineData.length === 0) return;

  const prices = klineData.map(item => item.close);
  const highs = klineData.map(item => item.high);
  const lows = klineData.map(item => item.low);
  const dates = klineData.map(item => item.date);

  // 设置图表配置
  const chartConfig = {
    height: options.height || 15,
    colors: [
      asciichart.blue,
      asciichart.green,
      asciichart.red
    ]
  };

  // 创建多线图表
  console.log(chalk.yellow(`\n${stockName}(${code}) ${type}K线图 (${klineData.length}个周期):`));
  console.log(chalk.yellow('价格走势 (蓝色:收盘价 绿色:最高价 红色:最低价)'));
  console.log(asciichart.plot([prices, highs, lows], chartConfig));

  // 显示日期范围
  console.log(chalk.cyan('\n时间范围:'));
  console.log(`${dates[0]} 至 ${dates[dates.length - 1]}`);

  // 显示统计信息
  const maxPrice = Math.max(...highs);
  const minPrice = Math.min(...lows);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priceChange = ((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(2);

  console.log(chalk.cyan('\n价格统计:'));
  console.log(chalk.green(`最高: ${maxPrice.toFixed(2)}`));
  console.log(chalk.red(`最低: ${minPrice.toFixed(2)}`));
  console.log(chalk.yellow(`平均: ${avgPrice.toFixed(2)}`));
  console.log(chalk.cyan(`区间涨跌: ${priceChange}%`));
}

async function printStock(list) {
  try {
    const options = program.opts();
    
    // 获取实时数据
    const response = await axios({
      method: 'get',
      url: `https://qt.gtimg.cn/q=${list.join(',')}`,
      responseType: "arraybuffer"
    });

    let data = iconv.decode(response.data, 'gbk');
    let arr = data.split('\n');
    let tableData = [];
    if (config.showHead) {
      tableData.push(columns);
    }

    for (let i = 0; i < arr.length - 1; i++) {
      let item = arr[i];
      let match = item.match(/v_(.+)="(.+)"/);
      if (match) {
        let values = match[2].split('~');
        let stockCode = match[1];
        let stockName = values[1];
        
        tableData.push([
          stockName,
          stockCode,
          values[3],
          values[32] + '%',
          values[4]
        ]);

        // 如果开启了日K或周K选项，获取并打印K线图表
        if (options.day) {
          const dayKData = await getKLineData(stockCode, 'day');
          printKLineChart(dayKData, '日', stockName, stockCode);
        }
        if (options.week) {
          const weekKData = await getKLineData(stockCode, 'week');
          printKLineChart(weekKData, '周', stockName, stockCode);
        }
      }
    }

    console.log('\n实时行情:');
    console.log(table(tableData));
  } catch (error) {
    console.error('获取数据失败:', error.message);
  }
}