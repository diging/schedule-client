import Vue, { PluginObject } from 'vue';
import axios from 'axios';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const authHeader: any = {};   
if (localStorage.getItem('token')) {   
  authHeader.Authorization = {    
    toString() {    
      return `Bearer ${localStorage.getItem('token')}`;    },    
    };   
  } 
  
const config = {    
  // baseURL: process.env.baseURL || process.env.apiUrl || ""    
  // timeout: 60 * 1000, // Timeout    
  // withCredentials: true, 
  // Check cross-site Access-Control    
  baseURL: process.env.VUE_APP_BACKEND_BASE_URL,    
  headers: {    'Content-Type': 'application/json',    ...authHeader,    },    
  xsrfCookieName: 'csrftoken',    xsrfHeaderName: 'X-CSRFToken',    
  withCredentials: true,       };

const _axios = axios.create(config);

_axios.interceptors.request.use(
  (cfg) => {
    // Do something before request is sent
    return cfg;
  },
  (err) => {
    // Do something with request error
    return Promise.reject(err);
  },
);

// Add a response interceptor
_axios.interceptors.response.use(
  (res) => {
    // Do something with response data
    return res;
  },
  (err) => {
    // Do something with response error
    return Promise.reject(err);
  },
);

const Plugin: PluginObject<any> = {
  install: (Vue) => {
    Vue.$axios = _axios;
  },
};
Plugin.install = (Vue) => {
  Vue.$axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
