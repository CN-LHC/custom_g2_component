import { Chart } from '@antv/g2';
{/* <g2-chart id="g2Chart"
    data-chart-type="area"
    data-api-config='{"url":"https://dtdataapi.wedengta.com/FinanceValue/FinanceValue","method":"post","contentType":"application/json","body":{"date":"2022-11-11T07:32:45.494Z"},"selectKeys":["交易日期","融资余额(亿元)","融券余额(亿元)"]}'
    data-chart-config='{"xScale":{"name":"交易日期"},"yScale":[{"name":"融资余额(亿元)","showAxis":true,"isLine":true,"isLabel":false},{"name":"融券余额(亿元)","showAxis":false,"isLine":true,"isLabel":false}]}'
></g2-chart> */}
function drawAreaChart(container, chartData, config) {
    const chart = new Chart({
        container: container,
        autoFit: true,
        // padding: 40,
        // appendPadding: 40, 
        height: 500, // autoFit为true不生效
        width: 500, // autoFit为true不生效
    });
    chart.data(chartData)
    if (config) {
        let scaleOptions = {}
        scaleOptions[config.xScale.name] = {
            range: [0, 1],
            tickCount: config.xScale.tickCount || 5
        }
        // 计算数据最大值
        let max = undefined
        if (config.yScale.length > 2) {
            let arr = []
            config.yScale.forEach((item) => {
                arr = arr.concat(chartData.map(value => value[item.name]))
            })
            max = Math.max(...arr)
        } else if (config.yScale.length === 2) {
            if (config.yScale.filter(item => item.showAxis).length < 2) {
                let arr = []
                config.yScale.forEach((item) => {
                    arr = arr.concat(chartData.map(value => value[item.name]))
                })
                max = Math.max(...arr)
            }
        }
        config.yScale.forEach((item) => {
            scaleOptions[item.name] = {
                nice: true,
                max,
                tickCount: item.tickCount || 10
            }
        })
        chart.scale(scaleOptions)
        config.yScale.forEach((item) => {
            chart.area().position(`${config.xScale.name}*${item.name}`);
            // 是否有折线
            if (item.isLine) {
                chart.line().position(`${config.xScale.name}*${item.name}`);
            }
            // 是否显示对应的坐标轴
            if (!item.showAxis) {
                chart.axis(item.name, false);
            }
        })
    }
    return chart
}
export default drawAreaChart