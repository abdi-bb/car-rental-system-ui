<template>
    <div>
      <h2>Customer Detail</h2>
      <div v-if="customer">
        <p>Name: {{ customer.name }}</p>
        <p>Email: {{ customer.email }}</p>
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
        customer: null,
      };
    },
    methods: {
      fetchCustomerData() {

        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Authorization': `JWT ${accessToken}`,
        };
        axios.get(`http://127.0.0.1:8000/api/v1/customers/${this.$route.params.id}`, { headers }).then(response => this.customer = response.data);
      },
    },
    created() {
      this.fetchCustomerData();
    },
  };
  </script>
  