import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  // 请求数据时加载状态loading
  fetchLoading: false,
  token: '',//token
  libLoaded: false,
  config: {
    inited: false,//初始化
    protocol: "http",
    apiDomain: "127.0.0.1",
    wsDomain: "127.0.0.1",
    wsPort: 3000
  },
  profile: {//用户非敏感信息
          inited: false,
          id: 0,//缓存当前用户id,尽量不用
          name: '',
          grants: {},//所有权限列表
      postname:'',
      utype:0
      },
  grantList: {
    inited: false,//是否初始化
  },
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
  strict: true,
})
