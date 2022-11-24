import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
{/* <g2-chart id="g2Chart"
data-chart-type="kLine"
data-api-config='{"url":"https://dtdataapi.wedengta.com/FinanceValue/day_qt_performance","body":{"SecuCode":"001336", "days":"60日"},"selectKeys":["TradingDay", "OpenPrice","HighPrice","LowPrice", "ClosePrice"]}'
data-chart-config='{}'
></g2-chart> */}
function drawkLine(container, data, config = {}) {
    const ds = new DataSet();
    const dv = ds.createView();
    dv.source(data)
    .transform({
        type: 'map',
        callback: obj => {
        obj.trend = (obj.OpenPrice <= obj.ClosePrice) ? '上涨' : '下跌';
        obj.range = [obj.OpenPrice, obj.ClosePrice, obj.HighPrice, obj.LowPrice];
        return obj;
        }
    });
    const chart = new Chart({
        container: container,
        autoFit: true,
        padding: config?.basicsPadding || undefined,
        // appendPadding: 40, 
        height: 500, // autoFit为true不生效
        width: 500, // autoFit为true不生效
    });

    chart.data(dv.rows);

    chart.scale({
        TradingDay: {
            type: 'timeCat',
            range: [0, 1],
            tickCount: config?.xScaleTickCount || 0,
        },
        trend: {
            values: ['上涨', '下跌']
        },
        volumn: { alias: '成交量' },
        OpenPrice: { alias: '开盘价' },
        ClosePrice: { alias: '收盘价' },
        HighPrice: { alias: '最高价' },
        LowPrice: { alias: '最低价' },
        range: {
            alias: '股票价格',
            nice: true,
            tickCount: config?.yScaleTickCount || 0,
        }
    });
    chart.tooltip({
    showTitle: false,
    showMarkers: false,
    itemTpl: '<li class="g2-tooltip-list-item" data-index={index}>'
        + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
        + '{name}{value}</li>'
    });

    chart.schema()
    .position('TradingDay*range')
    .color('trend', val => {
        if (val === '上涨') {
        return config?.riseColor || '#f04864';
        }

        if (val === '下跌') {
        return config?.fallColor || '#2fc25b';
        }
    })
    .shape('candle')
    .tooltip('TradingDay*OpenPrice*ClosePrice*HighPrice*LowPrice', (TradingDay, OpenPrice, ClosePrice, HighPrice, LowPrice) => {
        return {
        name: TradingDay,
        value: '<br><span style="padding-left: 16px;line-height: 16px;">开盘价：' + OpenPrice + '</span><br/>'
            + '<span style="padding-left: 16px;line-height: 16px;">收盘价：' + ClosePrice + '</span><br/>'
            + '<span style="padding-left: 16px;line-height: 16px;">最高价：' + HighPrice + '</span><br/>'
            + '<span style="padding-left: 16px;line-height: 16px;">最低价：' + LowPrice + '</span>'
        };
    });
    chart.axis('TradingDay', config?.xAxisVisible ? {
        label: {
            style: {
                fontSize: config?.xAxisLabelSize || 14,
                stroke: config?.xAxisLabelColor || undefined,
            }
        },
    } : false)
    chart.axis('range', config?.yAxisVisible ? {
        label: {
            style: {
                fontSize: config?.yAxisLabelSize || 14,
                stroke: config?.yAxisLabelColor || undefined,
            }
        },
    } : false);
    chart.interaction('element-active');
    return chart
}
export default drawkLine

