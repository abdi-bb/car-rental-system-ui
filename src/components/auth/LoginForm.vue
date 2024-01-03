<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="loginData.username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="loginData.password" required />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <p v-if="loginError">{{ loginError }}</p>
    </div>
  </template>
  
  <script>
  import { jwtDecode } from 'jwt-decode';

  export default {
    data() {
      return {
        loginData: {
          username: '',
          password: '',
        },
        loginError: '',
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/auth/jwt/create/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.loginData),
          });
  
          if (!response.ok) {
            throw new Error('Failed to authenticate user');
          }
  
          const responseData = await response.json();

          const decodedAccessToken = jwtDecode(responseData.access);

          const expirationTime = decodedAccessToken.exp * 1000;  // Convert to milliseconds
        
          this.$store.commit('setAccessToken', responseData.access);
          this.$store.commit('setRefreshToken', responseData.refresh);
          this.$store.commit('setTokenExpiration', expirationTime)

          this.$store.commit('setAuthentication', true);

          this.$router.push('/');
        } catch (error) {
          console.error('Error authenticating user:', error);
          this.loginError = 'Invalid username or password';
        }
      },
    },
  };
  </script>
  
  <style>
  </style>
  