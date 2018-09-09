<template>
    <div>
      <v-chart ref="bar" :data="barData">
        <v-scale x field="日期" />
        <v-scale y field="数量" />
        <v-bar series-field="name" adjust="stack" />
        <v-tooltip show-value-in-legend />
      </v-chart>
      <v-chart ref="line"  :data="lineData" prevent-default>
        <v-scale x :tick-count="5" />
        <v-scale y field="value" :min="0"  :formatter="percentFormatter" />
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
        methods: {
          percentFormatter(value){
            return value + '%';
          }
        },
        created(){
          let objOptions = {};
          objOptions.url = '/api/train/getstat';
          objOptions.action = '获取统计明细';
          objOptions.json = {qryparams: {}};
          objOptions.func = (json) => {
            this.lineData = json.list.map(item=>{
              let dRate = Math.floor(_common.getRate(item.correct, item.wrong));
              return {date: moment(item.stat_date).format('M-D'), value: dRate}
            });
            this.$refs.line.render();
            let arrBarData = [];
            json.list.forEach(item=>{
              arrBarData.push({name:'正确', 日期: moment(item.stat_date).format('M-D'), 数量: item.correct});
              arrBarData.push({name:'错误', 日期: moment(item.stat_date).format('M-D'), 数量: item.wrong});
            });
            this.barData = arrBarData;
            this.$refs.bar.render();
          }
          this.request(objOptions);
        },
        data() {
          return {
            barData: [
              {name: 'London', 日期: 'Jan.', 数量: 18.9},
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
