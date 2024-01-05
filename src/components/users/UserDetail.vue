<template>
    <div>
      <h2>Customer Detail</h2>
      <div v-if="user">
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
      </div>
      <div v-else>
        <p>Customer not found</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        user: null,
      };
    },
    methods: {
      fetchCustomerData() {

        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Authorization': `JWT ${accessToken}`,
        };
        axios.get(`http://127.0.0.1:8000/api/v1/auth/users/${this.$route.params.id}`, { headers }).then(response => this.user = response.data);
      },
    },
    created() {
      this.fetchCustomerData();
    },
  };
  </script>
  