import * as types from './mutation-types.js'

export default {
    // 请求数据时状态loading
    FETCH_LOADING({
                      commit
                  }, res) {
        commit(types.FETCH_LOADING, res)
    },

    // 设置token
    SET_TOKEN({
                  commit
              }, res) {
        commit(types.SET_TOKEN, res)
    },

    //设置个人资料
    SET_PROFILE({
                    commit
                }, res) {
        commit(types.SET_PROFILE, res)
    },

  //设置配置信息
  SET_CONFIG({
                   commit
                 }, res) {
    commit(types.SET_CONFIG, res)
  },

    //设置库加载完成
    SET_LIBLOADED({
                   commit
               }, res) {
        commit(types.SET_LIBLOADED, res)
    },


}
