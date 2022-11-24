import chartApi from './api/index';
import currentChart from './components/currentChart';
import { sleep } from './utils';

class G2_Chart extends HTMLElement {
  constructor() {
    super();
    this.chart = null
    this.dataApiConfig = {}
    let shadow = this.attachShadow({ mode: 'open' });
    let container = document.createElement('div');
    shadow.appendChild(container);

    container.setAttribute('class', 'g2_Chart');
    // 样式
    let style = document.createElement('style');
    style.textContent = `
      .g2_Chart {
        width: 100%;
        height: 100%;
      }
    `;
    shadow.appendChild(style);
  }
  // 画图
  drawChart() {
    if (this.chart?.destroy) {
      this.chart.destroy();
    }
    return new Promise(async (resolve, reject) => {
      let chartData = [];
      let chartConfig = {};
      // 获取数据
      if (this.getAttribute('data-api-config')) {
        try {
          this.dataApiConfig = JSON.parse(this.getAttribute('data-api-config'))
          chartData = await chartApi(this.dataApiConfig)
        } catch (error) {
          reject(error)
        }
      }
      // 获取data-chart-config配置
      if (this.getAttribute('data-chart-config')) {
        try {
          chartConfig = JSON.parse(this.getAttribute('data-chart-config'))
        } catch (error) {
          reject(error)
        }
      }
      // 渲染图表
      if (this.getAttribute('data-chart-type')) {
        try {
          this.chart = currentChart(this.getAttribute('data-chart-type'))(this.shadowRoot.childNodes[0], chartData, chartConfig instanceof Object && Object.keys(chartConfig).length > 0 ? chartConfig : null, this.dataApiConfig)
          if (this.chart?.render) {
            this.chart.render()
          }
        } catch (error) {
          reject(error)
        }
      }
      // 抛出renderChart事件, 表示图表已渲染完成
      let event = new CustomEvent('renderChart', { detail: this })
      this.dispatchEvent(event)
      resolve()
    })
  }
  // 自定义组件首次加载
  async connectedCallback(el) {
    // 监听自定义组件尺寸改变
    this.addEventListener('resizeChart', this.drawChart)
    await sleep(100)
    await this.drawChart()
  }
  // 自定义组件删除回调
  disconnectedCallback() {
    if (this.chart?.destroy) {
      this.chart.destroy();
    }
    // 注销监听自定义组件尺寸改变
    this.removeEventListener('resizeChart', this.drawChart)
  }
  adoptedCallback() {
    console.log('Custom square element moved to new page.');
  }
  // 自定义组件属性更新回调
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue && oldValue !== newValue) {
      this.drawChart().catch((error) => {
        console.log(error)
      })
    }
  }
  // 如果需要在元素属性变化后，触发 attributeChangedCallback()回调函数，
  // 你必须监听这个属性。这可以通过定义observedAttributes() get函数来实现
  static get observedAttributes() {
    return ['data-chart-type', 'data-api-config', 'data-chart-config']; 
  }
}
customElements.define('g2-chart', G2_Chart);