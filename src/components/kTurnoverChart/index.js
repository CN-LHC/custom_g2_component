import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
function drawKTurnover(container, data, config = {}) {
    // 设置状态量，时间格式建议转换为时间戳，转换为时间戳时请注意区间
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
        height: 500, // autoFit为true不生效
        width: 500, // autoFit为true不生效
    });

    chart.scale({
        TradingDay: {
            type: 'timeCat',
            range: [0, 1],
            tickCount: config?.xScaleTickCount || 0,
        },
        trend: {
            values: ['上涨', '下跌']
        },
        TurnoverVolume: { alias: '成交量' },
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
    // 绘制k线图
    const kView = chart.createView({
      region: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0.7 },
      }
    });
    kView.data(dv.rows);
    kView.schema()
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
    
    kView.axis('TradingDay', config?.xAxisVisible ? {
        label: {
            style: {
                fontSize: config?.xAxisLabelSize || 14,
                stroke: config?.xAxisLabelColor || undefined,
            },
        },
        tickLine: {
            alignTick: true,
            style: {
                opacity: 0,
            },
        },
        line: {
            style: {
                lineDash: [5]
            }
        }
    } : false)
    kView.axis('range', config?.yAxisVisible ? {
        label: {
            style: {
                fontSize: config?.yAxisLabelSize || 14,
                stroke: config?.yAxisLabelColor || undefined,
            }
        },
        grid: {
            line: {
                type: 'line',
                style: {
                    lineDash: [5]
                }
            }
        }
    } : false);

    const barView = chart.createView({
      region: {
        start: { x: 0, y: 0.7 },
        end: { x: 1, y: 1 },
      }
    });
    barView.data(dv.rows);
    barView.scale('TurnoverVolume', {
      tickCount: 2,
    })
    barView.axis('TradingDay', false);
    barView.axis('TurnoverVolume', false);
    barView.interval()
      .position('TradingDay*TurnoverVolume')
      .color('trend', val => {
        if (val === '上涨') {
          return '#f04864';
        }

        if (val === '下跌') {
          return '#2fc25b';
        }
      })
      .tooltip('TradingDay*TurnoverVolume', (TradingDay, TurnoverVolume) => {
        return {
          name: TradingDay,
          value: '<br/><span style="padding-left: 16px">成交量：' + TurnoverVolume + '</span><br/>'
        };
      });
    return chart
}
export default drawKTurnover