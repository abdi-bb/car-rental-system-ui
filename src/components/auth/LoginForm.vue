<template>
  <div class="container mt-5 pt-5 pb-5">
    <div class="border rounded p-4 bg-light">
      <h1>Login</h1>
    <form @submit.prevent="submitForm" class="mt-3">
      <div class="mb-3">
        <label for="username" class="form-label">Username:</label>
        <input type="text" id="username" v-model="loginData.username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" v-model="loginData.password" class="form-control" required />
      </div>
      <div>
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </form>
    <p v-if="loginError" class="mt-3 text-danger">{{ loginError }}</p>
  </div>
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
        loading: false,
      };
    },
    methods: {
      async submitForm() {
        this.loading = true
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
        } finally {
        this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style>
  </style>
  