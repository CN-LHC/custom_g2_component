import drawLineChart from './lineChart/index';
import drawBarChart from './barChart/index';
import drawAreaChart from './areaChart/index';
import drawkLine from './kLine/index';
import drawTimeShareChart from './timeShareChart/index'
export default function(type) {
    switch (type) {
        case 'line':
            return drawLineChart
        case 'bar':
            return drawBarChart
        case 'area':
            return drawAreaChart
        case 'kLine':
            return drawkLine
        case 'timeShareChart': // 分时图
            return drawTimeShareChart
        default:
            break
    }
}