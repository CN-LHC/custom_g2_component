import * as d3 from "d3";
import dataObj from './data'
function barD3Chart(container, data, config = {}) {
    config = {
        marginLeft: 50,
        marginRight: 50,
        marginTop: 50,
        marginBottom: 50,
        xDomain: undefined, // an array of (ordinal) x-values
        yDomain: undefined, // [ymin, ymax]
        duration: 400, //动画持续时长
        delay: 40, //元素之间间隔时长
        ease: "easeQuadOut", //元素之间间隔时长
        totalCount: 241,
        xTicks: ["9:30", "11:30/13:00", "15:00"]
    }
    data = dataObj
    const height = container.offsetHeight;
    const width = container.offsetWidth;
    const fClose = data.fPreClose; //前一个工作日的收盘价
    const timeData = data.data;
    const X = timeData.map((d) => d.label);

    //获取均线的最大值最小值
    let aveArr = [];
    data.data.map((item) => {
      aveArr.push(item.average);
    });
    const aveMin = d3.min(aveArr);
    const aveMax = d3.max(aveArr);

    //获取y轴的最大值最小值
    const timeMin = d3.min([data.fMin, aveMin]);
    const timeMax = d3.max([data.fMax, aveMax]);
    const yArr = [];

    //获取最终的三个点
    if (Math.abs(timeMax - fClose) >= Math.abs(timeMin - fClose)) {
      yArr.push(1 * timeMax.toFixed(2));
      yArr.push(1 * fClose.toFixed(2));
      yArr.push(1 * (fClose - (timeMax - fClose)).toFixed(2));
    } else {
      yArr.push(1 * (fClose + Math.abs(timeMin - fClose)).toFixed(2));
      yArr.push(1 * fClose.toFixed(2));
      yArr.push(1 * timeMin.toFixed(2));
    }

    if (config.xDomain === undefined) config.xDomain = X;
    if (config.yDomain === undefined) config.yDomain = [d3.min(yArr) * 1, d3.max(yArr) * 1];

    const xRange = [config.marginLeft, ((width - config.marginLeft - config.marginRight) * timeData.length) / 241 + config.marginLeft];

    const xScale = d3.scalePoint(config.xDomain, xRange);
    const yScale = d3.scaleLinear(config.yDomain, [height - config.marginBottom, config.marginTop]);

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    const yTick = [1, 2, 3, 4];
    const xTick = [1, 2, 3, 4, 5, 6, 7];
    const yTickSpace = (height - config.marginTop - config.marginBottom) / (yTick.length - 1);
    const xTickSpace = (width - config.marginLeft - config.marginRight) / (xTick.length - 1);
    //画网格
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
        .attr("stroke", "#F0F0F0")
        .attr("stroke-width", 2)
        .transition()
        .duration(config.duration / 2)
        .attr("x2", (d, i) => width - config.marginLeft)
        .attr("y2", (d, i) => config.marginTop + yTickSpace * i);

      svg
        .append("g")
        .attr("class", "x_tick_group")
        .selectAll("line")
        .data(xTick)
        .enter()
        .append("line")
        .attr("x1", (d, i) => config.marginLeft + xTickSpace * i)
        .attr("y1", (d, i) => height - config.marginBottom)
        .attr("x2", (d, i) => config.marginLeft + xTickSpace * i)
        .attr("y2", (d, i) => height - config.marginBottom)
        .attr("class", "x_tick")
        .attr("stroke", "#F0F0F0") //F0F0F0
        .attr("stroke-width", 2)
        .transition()
        .duration(config.duration / 2)
        .attr("x2", (d, i) => config.marginLeft + xTickSpace * i)
        .attr("y2", (d, i) => config.marginTop);
    };
    drawGrid();

    //画xy轴数据
    const drawXYTicks = () => {
      svg
        .append("g")
        .attr("class", "y_tick_group")
        .selectAll("text")
        .data(yArr)
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
        .duration(config.duration / 2)
        .attr("opacity", "1");

      const ratio = (((yArr[0] - fClose) / fClose) * 100).toFixed(2);
      const yArr2 = [ratio, -ratio];
      const yTick2 = svg
        .append("g")
        .attr("class", "y_tick_group2")
        .selectAll("text")
        .data(yArr2)
        .enter()
        .append("text")
        .attr("class", (d, i) => (i == 0 ? "y_tick_value y_tick_max" : "y_tick_value y_tick_min"))
        .text((d) => d + "%")
        .attr("x", width - config.marginRight - 5)
        .attr("y", (d, i) => {
          if (i == 0) {
            return config.marginTop;
          } else if (i == 1) {
            return height - config.marginBottom;
          }
        })
        .attr("text-anchor", "end")
        .attr("dy", (d, i) => {
          if (i == 0) {
            return "1.2em";
          } else if (i == 1) {
            return -5;
          }
        })
        .attr("fill", (d, i) => (i == 0 ? "#FF3B30" : "#18AA0C"))
        .attr("opacity", "0")
        .transition()
        .duration(config.duration / 2)
        .attr("opacity", "1");

      const xTick = svg
        .append("g")
        .attr("class", "x_tick_group")
        .selectAll("text")
        .data(config.xTicks)
        .enter()
        .append("text")
        .attr("class", (d, i) => (i == 0 ? "x_tick_value x_tick_max" : "x_tick_value x_tick_min"))
        .text((d) => d)
        .attr("x", (d, i) => {
          if (i == 0) {
            return config.marginLeft;
          } else if (i == config.xTicks.length - 1) {
            return width - config.marginRight;
          } else {
            return config.marginLeft + ((width - config.marginRight - config.marginLeft) / (config.xTicks.length - 1)) * i;
          }
        })
        .attr("y", height - config.marginBottom)
        .attr("text-anchor", (d, i) => {
          if (i == 0) {
            return "start";
          } else if (i == config.xTicks.length - 1) {
            return "end";
          } else {
            return "middle";
          }
        })
        .attr("dy", "1.2em")
        .attr("opacity", "0")
        .transition()
        .duration(config.duration / 2)
        .attr("opacity", "1");
    };
    drawXYTicks();

    //画线
    const drawLine = () => {
      const lineData = [timeData.map(d => d.now), timeData.map(d => d.average)];
      for (let j = 0; j < 2; j++) {
        const Y = lineData[j];
        const pathLine = d3
          .line()
          .curve(d3.curveLinear)
          .x((i) => xScale(X[i]))
          .y((i) => yScale(Y[i]));

        const svgLine = svg
          .append("path")
          .attr("fill", "none")
          .attr("class", (d) => (j == 0 ? `line now_line` : "line average_line"))
          .attr("stroke", (d) => (j == 0 ? "#178CEA" : "#fcaa05"))
          // .attr("stroke-width", "1")
          .attr("d", pathLine(d3.range(Y.length)));
        const svgLineTotalLength = svgLine.node().getTotalLength();
        svgLine
          .attr("stroke-dasharray", svgLineTotalLength + "," + svgLineTotalLength)
          .attr("stroke-dashoffset", svgLineTotalLength)
          .transition()
          .duration(config.duration)
          .ease(d3[config.ease])
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
      linearGradient.append("stop").attr("offset", "0%").style("stop-color", "#178CEA").style("stop-opacity", "0.42");
      linearGradient
        .append("stop")
        .style("stop-color", "#178CEA")
        .attr("offset", "100%")
        .style("stop-opacity", "0.16");

      //画区域图
      areaGroup
        .append("path")
        .attr("d", area([timeData[0]]))
        .attr("class", "line_area")
        .attr("fill", "url(#" + linearGradient.attr("id") + ")")
        .transition()
        .duration(config.duration)
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
    const theLastPoint = svg
      .append("circle")
      .attr("class", "the_last_point")
      .attr("cx", xScale(theLastItem.label))
      .attr("cy", yScale(theLastItem.now))
      .attr("r", 5)
      .attr("stroke-width", 9)
      .attr("stroke", "rgba(23, 140, 234, 0.5)")
      .attr("fill", "#178CEA")
      .attr("opacity", 0)
      .transition()
      .delay(config.duration == 0 ? 0 : 1400)
      .duration(config.duration == 0 ? 0 : 200)
      .attr("opacity", 1);

    //画起爆点
    const drawDetonate = (index) => {
      const lockData = timeData[index];
      const detonateGroup = svg.append("g").attr("class", "detonate_group");
      const detonateCircle = detonateGroup
        .append("circle")
        .attr("class", "detonate_point")
        .attr("cx", xScale(lockData.label))
        .attr("cy", yScale(lockData.lockValue))
        .attr("r", 6)
        .attr("stroke-width", 8)
        .attr("stroke", "rgba(255, 59, 48, 0.5)")
        .attr("fill", "#FF3B30")
        .attr("opacity", 0)
        .transition()
        .delay(config.duration == 0 ? 0 : 800)
        .duration(config.duration == 0 ? 0 : 200)
        .attr("opacity", 1);

      const detonateLine = detonateGroup
        .append("line")
        .attr("class", "detonate_line")
        .attr("x1", xScale(lockData.label))
        .attr("y1", yScale(lockData.lockValue))
        .attr("x2", xScale(lockData.label))
        .attr("y2", yScale(lockData.lockValue))
        .attr("stroke-dasharray", "3,3")
        .attr("stroke-width", 3)
        .attr("stroke", "#FF3B30")
        .transition()
        .delay(config.duration == 0 ? 0 : 800)
        .duration(config.duration == 0 ? 0 : 200)
        .attr("y2", yScale(lockData.lockValue) + 25);

      const detonateRect = detonateGroup
        .append("rect")
        .attr("class", "detonate_rect")
        .attr("x", xScale(lockData.label) - 35)
        .attr("y", yScale(lockData.lockValue) + 25)
        .attr("width", 70)
        .attr("height", 34)
        .attr("rx", 12)
        .attr("fill", "#FF3B30")
        .attr("opacity", 0)
        .transition()
        .delay(config.duration == 0 ? 0 : 800)
        .duration(config.duration == 0 ? 0 : 200)
        .attr("opacity", 1);

      const detonateText = detonateGroup
        .append("text")
        .attr("class", "detonate_text")
        .attr("x", xScale(lockData.label))
        .attr("y", yScale(lockData.lockValue) + 25)
        .attr("dy", "1.1em")
        .text("锁定")
        .attr("text-anchor", "middle")
        .attr("font-size", "22px")
        .attr("fill", "#fff")
        .attr("opacity", 0)
        .transition()
        .delay(config.duration == 0 ? 0 : 800)
        .duration(config.duration == 0 ? 0 : 200)
        .attr("opacity", 1);
    };
    const detonateIndex = timeData.findIndex(
      (d) => Object.prototype.toString.call(d.lockValue) !== "[object Undefined]"
    );
    if (detonateIndex !== -1) {
      drawDetonate(detonateIndex);
    }
    container.appendChild(svg.node());
    return svg
}

export default barD3Chart