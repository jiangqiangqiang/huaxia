// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import store from '../src/vuex/index'
import $ from 'jquery'
/* eslint-disable no-new */
Vue.use(element); 
import "../static/js/jweixin-1.4.0"
/*import { Button, ButtonGroup } from 'vue-ydui/dist/lib.rem/button';
/!* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; *!/

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);*/

/*import { Layout } from 'vue-ydui/dist/lib.rem/layout';
/!* 使用px：import {Layout} from 'vue-ydui/dist/lib.px/layout'; *!/

Vue.component(Layout.name, Layout);

import { NavBar, NavBarBackIcon, NavBarNextIcon } from 'vue-ydui/dist/lib.rem/navbar';
/!* 使用px：import {NavBar, NavBarBackIcon, NavBarNextIcon} from 'vue-ydui/dist/lib.px/navbar'; *!/

Vue.component(NavBar.name, NavBar);
Vue.component(NavBarBackIcon.name, NavBarBackIcon);
Vue.component(NavBarNextIcon.name, NavBarNextIcon);
import 'vue-ydui/dist/ydui.base.css';*/
/*import "@/commom/stylus/index.styl"*/
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
Vue.prototype.axios = axios;
Vue.prototype.qs = qs;
Vue.prototype.Cookies = Cookies;
~function () {
  var event = 'resize';
  'orientationchange' in window ? event = 'orientationchange' : null;
  function computed() {
    var winW1 = document.documentElement.clientWidth||document.body.clientWidth,
      desW = 320;
    console.log(winW1);
    document.documentElement.style.fontSize = winW1 >= desW ? `100px` : `${winW1 / desW * 100}px`;
  }
  computed();
  window.addEventListener(event, computed, false);
}();
