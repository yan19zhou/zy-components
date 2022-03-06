//import Vue from 'vue'
import{macarons} from './echart-theme/macarons'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
echarts.registerTheme('macarons', macarons)
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')


export default echarts