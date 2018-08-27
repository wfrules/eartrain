<template>
    <div>
        <div>
            <input type="text" place="用户名" v-model="uname" />
            <input type="password" place="密码" v-model="pass" />
        </div>
        <div>
            <button @click="register">注册</button>
            <button @click="login">登入</button>
        </div>
    </div>
</template>

<script>
    import * as types  from '@/store/mutation-types.js'
    export default {
        name: "login",
        data() {
            return {
                uname: '',
                pass: '',
            }
        },
        methods: {
            login(){
                let objElem = {};
                objElem.url = '/api/user/login';
                objElem.action = '登入判断';
                let objJson = {};
                objJson.uname = this.uname;
                objJson.pass = this.pass;
                objElem.json = objJson;
                objElem.func = (json) => {
                    this.$store.dispatch(types.SET_TOKEN, json.api_token);
                    this.$router.push('/train');

                };
                this.request(objElem);
            },
            register(){
                let objElem = {};
                objElem.url = '/api/user/register';
                objElem.action = '注册';
                let objJson = {};
                objJson.uname = this.uname;
                objJson.pass = this.pass;
                objElem.json = objJson;
                objElem.func = (json) => {
                    alert('注册成功');
                    this.$store.dispatch(types.SET_TOKEN, json.api_token);
                    this.$router.push('/train');

                };
                this.request(objElem);
            },
        }
    }
</script>

<style scoped>

</style>