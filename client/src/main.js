import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import filters from "./filters";
import VueSocketIO from "vue-socket.io";
import socketio from "socket.io-client";

// Setup Socket.io
export const SocketInstance = socketio();

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketInstance,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  filters,
  render: h => h(App)
}).$mount("#app");
