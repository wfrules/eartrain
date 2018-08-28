<template>
    <div>
        <x-header :left-options="{preventGoBack: true}" @on-click-back="backTrain">统计中心</x-header>
        <div>正确数{{score.right}}</div>
        <div>错误数{{score.wrong}}</div>  
        <div>连击数{{score.combo}}</div>
        <div>正确率{{rate}}%</div>
        <div>平均播放次数{{score.avg_played}}</div>
      <div v-for="apool in score.pool_result">{{apool.caption}}
          <span>正确{{apool.right}}</span><span>错误{{apool.wrong}}</span>
      </div>
      <x-button type="warn" @click.native="reset">清空</x-button>
    </div>
</template>

<script>
    import {XButton, XNumber, XHeader,Confirm  } from 'vux'
    import {Flexbox, FlexboxItem} from 'vux'
    import * as types from "@/store/mutation-types";
    export default {
        name: "stat",
        components: {
            XButton, Flexbox, FlexboxItem, XNumber, XHeader
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
              this.score.pool_result = json.pool_result;
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
