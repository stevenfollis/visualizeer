import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: false,
    socketMessage: '',
    nodes: [],
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },

    SOCKET_MESSAGE(state, message) {
      state.socketMessage = message[0];
    },

    SOCKET_NODES(state, nodes) {
      state.nodes = nodes[0];
    },
  },
  actions: {
    // socket_message: (context, message) => {
    //   context.dispatch('newMessage', message);
    //   context.commit('NEW_MESSAGE_RECEIVED', message);
    //   if (message.is_important) {
    //     context.dispatch('alertImportantMessage', message);
    //   }
    //         ...
    //     }
  },
});
