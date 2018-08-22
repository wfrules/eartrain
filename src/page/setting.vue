<template>
    <div>
        <x-header>个人中心</x-header>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gerenzhongxin"></use>
        </svg>
        {{$store.state.profile.name}}
        <svg class="icon" aria-hidden="true" @click="doLogout">
            <use xlink:href="#icon-zhuxiao"></use>
        </svg>

        <flexbox orient="vertical">
            <flexbox-item>
                <x-number title="速度(bpm)" v-model="speed"></x-number>
            </flexbox-item>
            <flexbox-item>
                <x-button  @click.native="doSave">
                    <svg class="icon" aria-hidden="true" >
                        <use xlink:href="#icon-baocun"></use>
                    </svg>
                </x-button>
            </flexbox-item>
        </flexbox>
    </div>
</template>

<script>
    import {XButton, XNumber, XHeader } from 'vux'
    import {Flexbox, FlexboxItem} from 'vux'
    import * as types from "@/store/mutation-types";
    export default {
        name: "setting",
        components: {
            XButton, Flexbox, FlexboxItem, XNumber, XHeader
        },
        data(){
            return {
                speed: this.$store.state.profile.speed,
            }
        },
        methods: {
            doSave(){
                let objOptions = {};
                objOptions.url = '/api/user/saveprofile';
                objOptions.action = '保存设置';
                objOptions.json = {speed: this.speed};
                objOptions.func = (json) => {
                    let objProfile =  {
                        inited: true,
                        id: json.profile.id,
                        name: json.profile.name,
                        speed: json.profile.speed,
                    };
                    this.$store.dispatch(types.SET_PROFILE, objProfile);
                    alert('保存完毕');
                }
                this.request(objOptions);
            },
            doLogout(){
                this.$store.dispatch(types.SET_TOKEN, '');
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>

</style>