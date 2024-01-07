import { createStore } from "vuex";

const store = createStore({
  state: {
    isAuthenticated: false,
    token: null,
    username: "",
    userId: null,
  },
  mutations: {
    setAuthentication(state, { isAuthenticated, token, username }) {
      state.isAuthenticated = isAuthenticated;
      state.token = token;
      state.username = username;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
  },
  actions: {
    initializeApp({ commit }) {
      const token = localStorage.getItem("auth_token");
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");

      const isAuthenticated = !!token;

      commit("setAuthentication", { isAuthenticated, token, username });
      commit("setUserId", userId);

      //console.log(token);
      //console.log('Initialize app action called. isAuthenticated:', isAuthenticated, 'username:', username, 'userId:', userId);
    },
  },
});

export default store;
