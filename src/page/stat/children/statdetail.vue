<template>
    <div>
        <divider>{{caption}}</divider>
        <simpleField caption="正确连击数" :val="score.combo"></simpleField>
        <simpleField caption="平均播放次数" :val="score.avg_played"></simpleField>
        <simpleField caption="平均每题耗时(s)" :val="score.avg_duration"></simpleField>
        <indicator caption="总计:" :right="score.right" :wrong="score.wrong"></indicator>
        <indicator  v-for="apool in score.pool_result" :caption="apool.caption"
                    :right="apool.right" :wrong="apool.wrong" :key="apool.caption"></indicator>
    </div>
</template>

<script>
    import _common from '@/com/common';
    import {XButton, XNumber, Confirm,Divider   } from 'vux'
    import indicator from '@/components/indicator';
    import simpleField from '@/components/simplefield';
    export default {
        name: "statdetail",
        components: {
            XButton, indicator,simpleField,Divider
        },
        props: {
            today: {
                type: Boolean,
                required: true,
            },
            caption: {
                type: String,
                required: true,
            },
        },
        created(){
            this.refresh();
        },
        methods: {
            refresh(){
                let objOptions = {};
                objOptions.url = '/api/train/getsum';
                objOptions.action = '获取分数';
                objOptions.json = {qryparams: {today: this.$props.today}};
                objOptions.func = (json) => {
                    this.setScore(json);
                }
                this.request(objOptions);
            },
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
    }
</script>

<style scoped>

</style>