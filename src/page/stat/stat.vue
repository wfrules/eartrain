<template>
    <div>
        <!--<x-header :left-options="{preventGoBack: true}" @on-click-back="backTrain">统计中心</x-header>-->
        <!--<input type="radio" value=0 name="tabIndex" v-model="tabIndex"/>-->
        <!--<input type="radio" value=1 name="tabIndex" v-model="tabIndex"/>-->
        <statDetail v-if="tabIndex==0" :today="false" caption="全部"></statDetail>
        <statDetail v-if="tabIndex==0" :today="true" caption="本日"></statDetail>
        <x-button type="warn" @click.native="reset">清空</x-button>
    </div>
</template>

<script>
    import _common from '@/com/common';
    import {XButton, XNumber, XHeader,Confirm ,  Tab, TabItem  } from 'vux'
    import {Flexbox, FlexboxItem} from 'vux'
    import * as types from "@/store/mutation-types";
    import statDetail from './children/statdetail';
    export default {
        name: "stat",
        components: {
            Tab, TabItem , XButton, Flexbox, FlexboxItem, XNumber, XHeader,statDetail
        },
        data(){
            return {
                tabIndex: 0,
            }
        },
        methods: {
            onItemClick(idx){
                alert(idx);
                this.tabIndex = idx;
            },
            reset(){
                if (confirm('确认清空吗?'))
                {
                    let objOptions = {};
                    objOptions.url = '/api/train/reset';
                    objOptions.action = '清空分数';
                    objOptions.json = {};
                    objOptions.func = (json) => {
                        alert('清空完毕');
                        this.$router.push('/train');
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
