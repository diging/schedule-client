import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { abilitiesPlugin, Can } from '@casl/vue';
import { buildAbilityFor } from './config/ability';


const ability = buildAbilityFor('member');

if (process.env.NODE_ENV !== 'production') {
	// exposed for debugging
	(window as any).ability = ability
  }


Vue.config.productionTip = false
Vue.use(abilitiesPlugin, ability);
Vue.component('Can', Can);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
