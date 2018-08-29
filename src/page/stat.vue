<template>
    <div>
        <x-header :left-options="{preventGoBack: true}" @on-click-back="backTrain">统计中心</x-header>
        <simpleField caption="正确连击数" :val="score.combo"></simpleField>
        <simpleField caption="平均播放次数" :val="score.avg_played"></simpleField>
        <simpleField caption="平均每题耗时(s)" :val="score.avg_duration"></simpleField>
        <indicator caption="总计:" :right="score.right" :wrong="score.wrong"></indicator>
        <indicator  v-for="apool in score.pool_result" :caption="apool.caption"
                    :right="apool.right" :wrong="apool.wrong" :key="apool.caption"></indicator>
      <x-button type="warn" @click.native="reset">清空</x-button>
    </div>
</template>

<script>
    import _common from '@/com/common';
    import {XButton, XNumber, XHeader,Confirm  } from 'vux'
    import {Flexbox, FlexboxItem} from 'vux'
    import * as types from "@/store/mutation-types";
    import indicator from '@/components/indicator';
    import simpleField from '@/components/simplefield';
    export default {
        name: "stat",
        components: {
            XButton, Flexbox, FlexboxItem, XNumber, XHeader,indicator,simpleField
        },
        computed: {
            rate(){
               let iTotal = this.score.right + this.score.wrong;
               return (iTotal)?(this.score.right*100/iTotal).toFixed(0):0;
            }
        },
        data(){
            return {
                score: {
                    right: '',
                    wrong: '',
                    combo: '',
                    avg_played: '',
                    avg_duration: '',
                    pool_result: [],
                },
            }
        },
        created(){
                let objOptions = {};
                objOptions.url = '/api/train/getsum';
                objOptions.action = '获取分数';
                objOptions.json = {};
                objOptions.func = (json) => {
                    this.setScore(json);
                }
                this.request(objOptions);
        },
        methods: {
            setScore(json){
              this.score.right = Number(json.right);
              this.score.wrong = Number(json.wrong);
              this.score.combo = Number(json.combo);
              this.score.avg_played = Number(json.avg_played);
              this.score.avg_duration = Number(json.avg_duration);
              this.score.pool_result = json.pool_result.sort((a,b)=>{
                let aTotal = _common.getRate(a.right, a.wrong);
                let bTotal = _common.getRate(b.right, b.wrong);
                let bRet = aTotal<bTotal;
                if (aTotal == bTotal)
                {
                  bRet = a.right < b.right;
                }
                return bRet;
              });
            },
            reset(){
                if (confirm('确认清空吗?'))
                {
                    let objOptions = {};
                    objOptions.url = '/api/train/reset';
                    objOptions.action = '清空分数';
                    objOptions.json = {};
                    objOptions.func = (json) => {
                        this.setScore(json);
                        alert('清空完毕');
                    }
                    this.request(objOptions);
                }
            },
            backTrain(){
                this.$router.push('/train');
            }
        }
    }
</script>

<style scoped>

</style>
