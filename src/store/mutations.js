import * as types  from './mutation-types.js'
import _common from '../com/common.js'
import mTool from '@/com/tool'
export default {
  // 请求数据时loading
  [types.FETCH_LOADING] (state, res) {
    state.fetchLoading = res;
  },
  // 设置Token
  [types.SET_TOKEN] (state, res) {
    state.token = res;
      mTool.setCookie(res);
  },

  // 设置身份信息
  [types.SET_PROFILE] (state, res) {
    state.profile = res;
  },

  // 设置配置信息
    [types.SET_CONFIG] (state, res) {
        state.config = res;
    },

    // 设置库加载完毕
    [types.SET_LIBLOADED] (state, res) {
        state.libLoaded = res;
    },


}
