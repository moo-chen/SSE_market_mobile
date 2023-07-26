import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import 'amfe-flexible';
import './assets/css/index.css';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(Vant);
Vue.use(VueAxios, axios);
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
