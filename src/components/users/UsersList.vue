<template>
    <div>
      <h2>Customers List</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          <router-link :to="{ name: 'UserDetail', params: { id: user.id }}">
            {{ user.username }} - {{ user.phone_number || 'Phone Number N/A'}}
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { refreshToken } from '@/services/refresh.token';
  
  export default {
    data() {
      return {
        users: [],
      };
    },
    methods: {
      async fetchData() {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Authorization': `JWT ${accessToken}`,
        };

        const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/users', { headers });

        this.users = response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshToken(this.$store);
            const newHeaders = {
              'Authorization': `JWT ${newAccessToken}`,
            };
            const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/users', { headers: newHeaders });

            this.users = response.data;
          } catch (refreshError) {
            console.error('Failed to refresh access token:', refreshError);
          }
        } else {
          console.error('Error fetching data:', error);
        }
      }
    },
  },
    created() {
      this.fetchData();
    },
  };
  </script>
  
  <style>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f4f4f4;
    border-radius: 8px;
    cursor: pointer;
  }
  
  li:hover {
    background-color: #ddd;
  }
  
  router-link {
    text-decoration: none;
    color: #333;
  }
  </style>
  