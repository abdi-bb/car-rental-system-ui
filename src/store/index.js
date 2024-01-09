import { refreshToken } from "@/services/refresh.token";
import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    isAuthenticated: false,
    isStaff: false,
    accessToken: null,
    refreshToken: null,
    username: "",
    userId: null,
  },
  mutations: {
    setAuthentication(state, { isAuthenticated, isStaff, accessToken, username }) {
      state.isAuthenticated = isAuthenticated;
      state.isStaff = isStaff;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.username = username;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
  },
  actions: {
    async initializeApp({ commit }) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");
  
      if (accessToken) {
        try {
          const headers = {
            Authorization: `JWT ${accessToken}`,
          };
          // Send a request to the backend to check the user's authentication status and staff status
          const response = await axios.get('http://localhost:8000/api/v1/auth/users/me', { headers });
      
          const isAuthenticated = !!accessToken;
          const isStaff = response.data.is_staff;
  
          commit("setAuthentication", {
            isAuthenticated,
            isStaff,
            accessToken,
            refreshToken,
            username
          });
          commit("setUserId", userId);
        } catch (error) {
            if (error.response) {
              console.error('Error during initialization:', error.response.data);
            } else if (error.request) {
              console.error('No response received during initialization:', error.request);
            } else {
              console.error('Error setting up the request during initialization:', error.message);
            }
          commit("setAuthentication", {
            isAuthenticated: false,
            isStaff: false,
            accessToken: null,
            refreshToken: null,
            username: ""
          });
          commit("setUserId", null);
        }
      }
    },
  },
});

export default store;
