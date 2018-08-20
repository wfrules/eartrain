// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as types from './store/mutation-types.js'
import store from './store/'
import {request,checkGrant} from './com/extend.js'
import axios from 'axios'
import mTool from '@/com/tool.js'

import { AlertPlugin, LoadingPlugin, ToastPlugin, ConfirmPlugin} from 'vux'
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

Vue.prototype.request = request;//挂载全局的请求方法
Vue.config.productionTip = false

let routerDeal = function(to, from, next){
    let sCookie =  mTool.getCookie();
    store.dispatch(types.SET_TOKEN, sCookie);
    if ((!to.meta.guest) && (!store.state.token))
    {//非访客
        router.push('/login');
        return;
    }
    else {
        document.title = (to.meta.title)?to.meta.title:"";//默认title为空
        if (to.meta.guest)
        {//访客页面
            next();
        }
        else
        {
            if (store.state.profile.inited)
            {//视为已取得了身份信息详情
                next();
            }
            else {
                let objProfile = {};
                objProfile.url = '/api/user/getprofile';
                objProfile.action = '身份校验';
                objProfile.json = {parms: {}, api_token: store.state.token};
                objProfile.func = (profile) => {
                    let objProfile =  {
                        inited: true,
                        id: profile.uid,
                        name: profile.uname,
                        grants: {},
                        postname:profile.postname,
                        utype:profile.utype
                    };
                    store.dispatch(types.SET_PROFILE, objProfile);
                    next();
                }
                mTool.request(objProfile);
            }
        }
    }
}

router.beforeEach(function(to, from, next){
        if (!store.state.config.inited) {//没有初始化则初始化
            let sConfigUrl = 'http://' + window.location.host + '/cliconfig.json';
            if (process.env.NODE_ENV == "development")
            {//让开发和生产路径不一样防止配置文件错误
                sConfigUrl = 'http://' + window.location.host + '/static/cliconfig.json';
            }
            let objGetConfig = axios.get(sConfigUrl, {}).then(res => {
                    let objConfig = res.data;
                    objConfig.inited = true;
                    store.dispatch(types.SET_CONFIG, objConfig);
                    axios.defaults.baseURL = objConfig.protocol + '://' + objConfig.apiDomain;
                    routerDeal(to, from, next);
                },
                err => {
                    alert('无法获取配置文件cliconfig.json');
                    routerDeal(to, from, next);
                }
            );

        }
        else
        {
            routerDeal(to, from, next);
        }
    }
)




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
