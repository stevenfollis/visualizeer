import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: false,
    socketMessage: "",
    nodes: []
  },
  mutations: {
    SOCKET_connect(state) {
      state.isConnected = true;
    },

    SOCKET_disconnect(state) {
      state.isConnected = false;
    },

    SOCKET_message(state, message) {
      state.socketMessage = message[0];
    },

    SOCKET_nodes(state, nodes) {
      state.nodes = nodes;
    }
  },
  actions: {}
});
