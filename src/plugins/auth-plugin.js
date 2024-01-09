export default {
    install: (app, options) => {
      const token = localStorage.getItem("auth_token");
      const isAuthenticated = !!token;
  
      app.config.globalProperties.$store.commit("setAuthentication", {
        isAuthenticated,
        token,
      });
    },
  };
  