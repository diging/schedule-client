import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import 'material-design-icons-iconfont/dist/material-design-icons.css';


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
