<template>
  <div>
    <TheNavigation />
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import TheNavigation from './views/TheNavigation.vue';
import Footer from './views/Footer.vue';

export default {
  name: 'App',
  components: {
    TheNavigation,
    Footer,
  },
  computed: {
    isAuthenticated() {
      const expirationTime = localStorage.getItem('tokenExpiration');
      if (expirationTime === null) {
        return false;
      }
      return new Date().getTime() < expirationTime;
    },
  },
  methods: {
    async logout() {
      try {
        await axios.post(
          'http://127.0.0.1:8000/api/v1/auth/jwt/logout/',
          { refresh: localStorage.getItem('refreshToken') },
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiration');

        this.$store.commit('setAuthentication', false);

        this.$router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  display: flex;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
}

nav a.router-link-exact-active {
  color: white;
  background: crimson;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-actions button,
.user-actions router-link {
  margin-left: 10px;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.user-actions router-link {
  text-decoration: none;
}

.user-actions {
  margin-left: auto;
}
</style>
