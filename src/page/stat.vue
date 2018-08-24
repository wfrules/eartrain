<template>
    <div>
        <x-header :left-options="{preventGoBack: true}" @on-click-back="backTrain">统计中心</x-header>
        <div>正确数{{score.right}}</div>
        <div>错误数{{score.wrong}}</div>  
        <div>正确率{{rate}}%</div>  
        <x-button @click.native="reset">清空</x-button>      
    </div>
</template>

<script>
    import {XButton, XNumber, XHeader } from 'vux'
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
                    right: 0,
                    wrong: 0,
                },
            }
        },
        created(){
                let objOptions = {};
                objOptions.url = '/api/train/getsum';
                objOptions.action = '获取分数';
                objOptions.json = {};
                objOptions.func = (json) => {
                    this.score.right = Number(json.right);
                    this.score.wrong = Number(json.wrong);
                }
                this.request(objOptions);
        },
        methods: {
            reset(){
                let objOptions = {};
                objOptions.url = '/api/train/reset';
                objOptions.action = '清空分数';
                objOptions.json = {};
                objOptions.func = (json) => {
                    this.score.right = Number(json.right);
                    this.score.wrong = Number(json.wrong);                    
                    alert('清空完毕');
                }
                this.request(objOptions);
            },
            backTrain(){
                this.$router.push('/train');
            }
        }
    }
</script>

<style scoped>

</style>