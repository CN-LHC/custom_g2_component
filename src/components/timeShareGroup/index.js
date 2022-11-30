/*
 * @Author: liuhanchuan 
 * @Date: 2022-11-30 15:17:46 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-11-30 16:59:58
 * 支持配置多条折线、图例绑定数据、支持双y轴(可控制)
 *  图例: 显示是根据yAxis的数量
 *  双y轴: 当yAxis的数量>=3或=1，只显示一个y轴; 当yAxis的数量=2，且axis都是true显示双y轴
 */
import * as d3 from "d3";
import dataObj from './data'
function timeShareGroup(container, data, config = {}) {
    config = {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 40,
        marginBottom: 30,
        yAxis: [{
                name: 'now',
                strokeWidth: 2,
                strokeColor: 'red',
                legend: true,
                axis: true,
            },
            {
                name: 'average',
                strokeWidth: 2,
                strokeColor: 'blue',
                legend: false,
                axis: true,
            },
            {
                name: 'volumeRatio',
                strokeWidth: 2,
                strokeColor: 'yellow',
                legend: true,
                axis: false,
            }
        ],
    }
    data = dataObj
    const height = container.offsetHeight;
    const width = container.offsetWidth;
    const timeData = data.data;
    const X = timeData.map((d) => d.label);
    let Y = [];
    config.yAxis.forEach((item) => {
        Y.push(d3.min(timeData.map((d) => d[item.name])) * 1)
        Y.push(d3.max(timeData.map((d) => d[item.name])) * 1)
    })
    // 比例尺
    const xDomain = X;
    const xScale = d3.scalePoint(xDomain, [config.marginLeft, ((width - config.marginLeft - config.marginRight) * timeData.length) / 241 + config.marginLeft]);

    let yDomain1 = [d3.min(Y) * 1, d3.max(Y) * 1];
    let yDomain2 = [];
    // 当显示双y轴的时候
    if (config.yAxis.length === 2 && config.yAxis.filter(item => item.axis).length === 2) {
        yDomain1 = [d3.min(timeData.map((d) => d[config.yAxis[0].name])) * 1, d3.max(timeData.map((d) => d[config.yAxis[0].name])) * 1];
        yDomain2 = [d3.min(timeData.map((d) => d[config.yAxis[1].name])) * 1, d3.max(timeData.map((d) => d[config.yAxis[1].name])) * 1];
    }
    const yScale1 = d3.scaleLinear(yDomain1, [height - config.marginBottom, config.marginTop]);
    const yScale2 = d3.scaleLinear(yDomain2, [height - config.marginBottom, config.marginTop]);
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    // 画标题
    const drawTitle = () => {
        svg.append('g')
        .attr('class', 'chart_title')
        .append("text")
        .text('分时组合')
        .attr('x', config.marginLeft)
        .attr('y', config.marginTop)
        .attr("style", "fill: #000; font-size: 16px; font-weight: bold; transform: translateY(-24px);")
        .attr("opacity", "0")
        .transition()
        .duration(200)
        .attr("opacity", "1");
    }
    drawTitle()
    // 绘制legend
    const drawLegend = () => {
        let legends = svg.selectAll(".legend").data(config.yAxis);
        legends.enter()
        .append("foreignObject")
        .attr('y', config.marginTop)
        .attr('x', (d, i) => width - (config.yAxis.length - i) * 100)
        .attr("width", 100)
        .attr("height", 24)
        .style("transform", "translateY(-40px)")
        .append("xhtml:div")
        .attr('class', 'legend')
        .merge(legends)
        .style('color', d => d.legend ? '#000' : 'red')
        .html(d => d.name)
        .on('click', (el, d) => {
            config.yAxis.forEach((val) => {
                if (val.name === d.name) {
                    val.legend = !val.legend
                }
            })
            drawLegend()
            svg.selectAll('.line').remove()
            drawLine()

        })
    }
    drawLegend()
    //画网格
    const yTick = [1, 2, 3, 4, 5, 6];
    const yTickSpace = (height - config.marginTop - config.marginBottom) / (yTick.length - 1);
    const drawGrid = () => {
        svg
        .append("g")
        .attr("class", "y_tick_group")
        .selectAll("line")
        .data(yTick)
        .enter()
        .append("line")
        .attr("x1", (d, i) => config.marginLeft)
        .attr("y1", (d, i) => config.marginTop + yTickSpace * i)
        .attr("x2", (d, i) => config.marginLeft)
        .attr("y2", (d, i) => config.marginTop + yTickSpace * i)
        .attr("class", "y_tick")
        .attr("stroke", "#F0F0F0") // 线的颜色
        .attr("stroke-width", 2) // 线的宽度
        .attr("stroke-dasharray", 5) // 虚线5,5简写为5
        .transition()
        .duration(config.duration / 2)
        .attr("x2", (d, i) => width - config.marginLeft)
        .attr("y2", (d, i) => config.marginTop + yTickSpace * i);
    };
    drawGrid();

    //画xy轴数据
    const drawXYTicks = () => {
        // y1轴 当有一个或一个以上的y轴配置显示y轴
        if (config.yAxis.filter(item => item.axis).length > 0) {
            svg
            .append("g")
            .attr("class", "y_tick_group")
            .selectAll("text")
            .data([yDomain1[0].toFixed(2), yDomain1.reduce((a, b) => a + b).toFixed(1), yDomain1[0].toFixed(1)])
            .enter()
            .append("text")
            .attr("class", (d, i) => {
            if (i == 0) {
                return " y_tick_value y_tick_max";
            } else if (i == 1) {
                return " y_tick_value y_tick_middle";
            } else if (i == 2) {
                return " y_tick_value y_tick_min";
            }
            })
            .text((d) => d)
            .attr("x", config.marginLeft + 5)
            .attr("y", (d, i) => {
            if (i == 0) {
                return config.marginTop;
            } else if (i == 1) {
                return (height - config.marginBottom - config.marginTop) / 2 + config.marginTop;
            } else if (i == 2) {
                return height - config.marginBottom;
            }
            })
            .attr("text-anchor", "start")
            .attr("dy", (d, i) => {
            if (i == 0) {
                return "1.2em";
            } else if (i == 1) {
                return "0.5em";
            } else if (i == 2) {
                return -5;
            }
            })
            .attr("fill", (d, i) => (i == 0 ? "#FF3B30" : i == 2 ? "#18AA0C" : "#666"))
            .attr("opacity", "0")
            .transition()
            .duration(200)
            .attr("opacity", "1");
        }
        // y2轴 显示双y轴
        if (yDomain2.length === 2) {
            svg
            .append("g")
            .attr("class", "y_tick_group")
            .selectAll("text")
            .data([yDomain2[0].toFixed(2), yDomain2.reduce((a, b) => a + b).toFixed(1), yDomain2[0].toFixed(1)])
            .enter()
            .append("text")
            .attr("class", (d, i) => {
            if (i == 0) {
                return " y_tick_value y_tick_max";
            } else if (i == 1) {
                return " y_tick_value y_tick_middle";
            } else if (i == 2) {
                return " y_tick_value y_tick_min";
            }
            })
            .text((d) => d)
            .attr("x", width - config.marginLeft - config.marginRight - 40)
            .attr("y", (d, i) => {
            if (i == 0) {
                return config.marginTop;
            } else if (i == 1) {
                return (height - config.marginBottom - config.marginTop) / 2 + config.marginTop;
            } else if (i == 2) {
                return height - config.marginBottom;
            }
            })
            .attr("text-anchor", "start")
            .attr("dy", (d, i) => {
            if (i == 0) {
                return "1.2em";
            } else if (i == 1) {
                return "0.5em";
            } else if (i == 2) {
                return -5;
            }
            })
            .attr("fill", (d, i) => (i == 0 ? "#FF3B30" : i == 2 ? "#18AA0C" : "#666"))
            .attr("opacity", "0")
            .transition()
            .duration(200)
            .attr("opacity", "1");
        }
        // x轴
        const xTicks = ["9:30", "11:30/13:00", "15:00"]
        svg
            .append("g")
            .attr("class", "x_tick_group")
            .selectAll("text")
            .data(xTicks)
            .enter()
            .append("text")
            .attr("class", (d, i) => (i == 0 ? "x_tick_value x_tick_max" : "x_tick_value x_tick_min"))
            .text((d) => d)
            .attr("x", (d, i) => {
            if (i == 0) {
                return config.marginLeft;
            } else if (i == xTicks.length - 1) {
                return width - config.marginRight;
            } else {
                return config.marginLeft + ((width - config.marginRight - config.marginLeft) / (xTicks.length - 1)) * i;
            }
            })
            .attr("y", height - config.marginBottom)
            .attr("text-anchor", (d, i) => {
            if (i == 0) {
                return "start";
            } else if (i == xTicks.length - 1) {
                return "end";
            } else {
                return "middle";
            }
            })
            .attr("dy", "1.2em")
            .attr("opacity", "0")
            .transition()
            .duration(200)
            .attr("opacity", "1");
    };
    drawXYTicks();

    //画线
    const drawLine = () => {
        let lineData = []
        config.yAxis.forEach((item) => {
            if (item.legend) {
                lineData.push(timeData.map(d => d[item.name]))
            }
        })
        for (let j = 0; j < lineData.length; j++) {
            const currentLineData = lineData[j];
            const pathLine = d3
            .line()
            .curve(d3.curveLinear)
            .x((i) => xScale(X[i]))
            .y((i) => {
                if (yDomain2.length === 2) {
                    if (lineData.length === 2) {
                        return j === 0 ? yScale1(currentLineData[i]) : yScale2(currentLineData[i])
                    } else {
                        let index = 0;
                        config.yAxis.forEach((item, i) => {
                            if (item.legend) {
                                index = i
                            }
                        })
                        return index ? yScale2(currentLineData[i]) : yScale1(currentLineData[i])
                    }
                } else {
                    return yScale1(currentLineData[i])
                }
            });

            const svgLine = svg
                .append("path")
                .attr("fill", "none")
                .attr("class", "line now_line")
                .attr("stroke", config.yAxis.filter(item => item.legend)[j].strokeColor)
                .attr("stroke-width", config.yAxis.filter(item => item.legend)[j].strokeWidth)
                .attr("d", pathLine(d3.range(currentLineData.length)));
            const svgLineTotalLength = svgLine.node().getTotalLength();

            svgLine
                .attr("stroke-dasharray", svgLineTotalLength + "," + svgLineTotalLength)
                .attr("stroke-dashoffset", svgLineTotalLength)
                .transition()
                .duration(200)
                .ease(d3.easeQuadOut)
                .attr("stroke-dashoffset", 0);
        }
    };
    drawLine();


    // 注销当前图表
    const destroy = () => {
        container.innerHTML = ''
    }
    // 渲染当前图表
    const render = () => {
        container.appendChild(svg.node());
    }
    svg.destroy = destroy
    svg.render = render
    return svg
}

export default timeShareGroup