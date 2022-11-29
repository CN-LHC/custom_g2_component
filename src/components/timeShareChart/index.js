import * as d3 from "d3";
import dataObj from './data'
function barD3Chart(container, data, config = {}) {
    config = {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 50,
        marginBottom: 30,
        strokeWidth: 2, // 设置线粗细
        strokeColor: 'red', // 设置线宽度
    }
    data = dataObj
    const height = container.offsetHeight;
    const width = container.offsetWidth;
    const timeData = data.data;
    const X = timeData.map((d) => d.label);
    const Y = timeData.map((d) => d.now);

    const xDomain = X;
    const yDomain = [d3.min(Y) * 1, d3.max(Y) * 1];

    // 比例尺
    const xScale = d3.scalePoint(xDomain, [config.marginLeft, ((width - config.marginLeft - config.marginRight) * timeData.length) / 241 + config.marginLeft]);
    const yScale = d3.scaleLinear(yDomain, [height - config.marginBottom, config.marginTop]);

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    // 画标题
    svg.append('g')
    .attr('class', 'chart_title')
    .append("text")
    .text('分时')
    .attr('x', config.marginLeft)
    .attr('y', 24)
    .attr("style", "fill: #000; font-size: 16px; font-weight: bold")
    .attr("opacity", "0")
    .transition()
    .duration(200)
    .attr("opacity", "1");
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
        // y轴
        svg
            .append("g")
            .attr("class", "y_tick_group")
            .selectAll("text")
            .data([d3.max(Y).toFixed(2) * 1, ((d3.min(Y).toFixed(2) * 1 + d3.max(Y).toFixed(2) * 1) / 2).toFixed(2) * 1, d3.min(Y).toFixed(2) * 1])
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
    //   const lineData = [timeData.map(d => d.now), timeData.map(d => d.average)];
    const lineData = [timeData.map(d => d.now)];
      for (let j = 0; j < 1; j++) {
        const currentLineData = lineData[j];
        const pathLine = d3
          .line()
          .curve(d3.curveLinear)
          .x((i) => xScale(X[i]))
          .y((i) => yScale(currentLineData[i]));

        const svgLine = svg
          .append("path")
          .attr("fill", "none")
          .attr("class", "line now_line")
          .attr("stroke", config.strokeColor)
          .attr("stroke-width", config.strokeWidth)
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

    //画面积
    const drawArea = () => {
      var area = d3
        .area()
        .x(function (d, i) {
          return xScale(d.label);
        }) //对x轴进行缩放
        .y0(height - config.marginBottom) //定义y0轴
        .y1(function (d) {
          return yScale(d.now);
        }); //对y1轴进行缩放

      //画渐变
      const areaGroup = svg.append("g").attr("class", "area_group");
      const defs = areaGroup.append("defs");
      const linearGradient = defs
        .append("linearGradient")
        .attr("id", "linearColor")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      linearGradient.append("stop").attr("offset", "0%").style("stop-color", config.strokeColor).style("stop-opacity", "0.42");
      linearGradient
        .append("stop")
        .style("stop-color", config.strokeColor)
        .attr("offset", "100%")
        .style("stop-opacity", "0.16");

      //画区域图
      areaGroup
        .append("path")
        .attr("d", area([timeData[0]]))
        .attr("class", "line_area")
        .attr("fill", "url(#" + linearGradient.attr("id") + ")")
        .transition()
        .duration(200)
        .attrTween("d", () => {
          let index = d3.interpolate(0, timeData.length - 1);
          return (t) => {
            let deg = Math.round(index(t));
            return area(timeData.slice(0, deg + 1));
          };
        });
    };
    drawArea();

    //画最后一个点
    const theLastItem = timeData[timeData.length - 1];
    const theLastPoint = (item) => {
        svg
        .append("circle")
        .attr("class", "the_last_point")
        .attr("cx", xScale(item.label))
        .attr("cy", yScale(item.now))
        .attr("r", config.strokeWidth * 2)
        .attr("stroke-width", config.strokeWidth)
        .attr("stroke", "#fff")
        .attr("fill", config.strokeColor)
        .attr("style", `transform: translateX(-${config.strokeWidth * 2}px)`)
        .attr("opacity", 0)
        .transition()
        .delay(400)
        .duration(200)
        .attr("opacity", 1);
    }
    if (theLastItem) {
      theLastPoint(theLastItem)
    }

    container.appendChild(svg.node());
    return svg
}

export default barD3Chart