import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import vuexs from '../vuexs/vuexs'

export default new vuex.Store({
  modules:{
    vuexs:vuexs
  },
  mutations:{

  }
})
