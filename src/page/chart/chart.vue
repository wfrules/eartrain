<template>
    <div>
      <v-chart ref="demo" :data="barData">
        <v-scale x field="日期" />
        <v-scale y field="数量" />
        <v-bar series-field="name" adjust="stack" />
        <v-tooltip show-value-in-legend />
      </v-chart>
      <v-chart :data="lineData" prevent-default>
        <v-scale x :tick-count="3" />
        <v-tooltip :show-item-marker="false" show-x-value />
        <v-line />
      </v-chart>
    </div>
</template>

<script>
  import { VChart, VLine, VArea, VTooltip, VLegend, VBar, XButton, VScale } from 'vux'
  import _common from '@/com/common';
  let moment = require('moment');
    export default {
        name: "chart",
        components: {
          VChart,
          VLine,
          VArea,
          VTooltip,
          VLegend,
          VBar,
          XButton,
          VScale
        },
        created(){
          let objOptions = {};
          objOptions.url = '/api/train/getstat';
          objOptions.action = '获取统计明细';
          objOptions.json = {qryparams: {}};
          objOptions.func = (json) => {
            this.lineData = json.list.map(item=>{
              let dRate = _common.getRate(item.correct, item.wrong);
              return {date: moment(item.stat_date).format('YYYY-MM-DD'), value: dRate}
            });
            let arrBarData = [];
            json.list.forEach(item=>{
              arrBarData.push({name:'正确', 日期: moment(item.stat_date).format('YYYY-MM-DD'), 数量: item.correct});
              arrBarData.push({name:'错误', 日期: moment(item.stat_date).format('YYYY-MM-DD'), 数量: item.wrong});
            });
            this.barData = arrBarData;
          }
          this.request(objOptions);
        },
        data() {
          return {
            barData: [
              {name: 'London', 日期: 'Jan.', 数量: 18.9},
              {name: 'Berlin', 日期: 'Mar.', 数量: 34.5},
            ],
            lineData:  [
              { date: '2017-06-05', value: 116 },
            ]
          }
        }
    }
</script>

<style scoped>

</style>
