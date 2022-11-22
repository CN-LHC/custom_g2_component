import drawLineChart from './lineChart/index';
import drawBarChart from './barChart/index';
import drawAreaChart from './areaChart/index';
// import drawDefaultChart from './defaultChart/index';
import drawkLine from './kLine/index';
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
        default:
            // return drawDefaultChart
            break
    }
}