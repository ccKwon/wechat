import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import io from 'socket.io-client'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.io = io;

new Vue({
  data: {
    me:null
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
