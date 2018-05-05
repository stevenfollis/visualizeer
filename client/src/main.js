import Vue from 'vue';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import store from './store';
import router from './router';
import filters from './filters';

// Setup Socket.io
export const SocketInstance = socketio();
Vue.use(VueSocketIO, SocketInstance, store);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  filters,
  render: h => h(App),
}).$mount('#app');
