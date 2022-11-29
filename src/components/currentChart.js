import drawLineChart from './lineChart/index';
import drawBarChart from './barChart/index';
import drawAreaChart from './areaChart/index';
import drawkLine from './kLine/index';
import drawTimeShareChart from './timeShareChart/index'
import drawkTurnoverChart from './kTurnoverChart/index'
export default function(type) {
    switch (type) {
        case 'line':
            return drawLineChart
        case 'bar':
            return drawBarChart
        case 'area':
            return drawAreaChart
        case 'kLine': // k线图
            return drawkLine
        case 'timeShareChart': // 分时图
            return drawTimeShareChart
        case 'kTurnoverChart': // k线-成交量
            return drawkTurnoverChart
        default:
            break
    }
}