<template>
    <div>
      <h2>Customers List</h2>
      <ul>
        <li v-for="customer in customers" :key="customer.id">
          <router-link :to="{ name: 'CustomerDetail', params: { id: customer.id }}">
            {{ customer.username }} - {{ customer.phone_number || 'Phone Number N/A'}}
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        customers: [],
      };
    },
    methods: {
      fetchData() {
        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Authorization': `JWT ${accessToken}`,
        };

        axios.get('http://127.0.0.1:8000/api/v1/customers', { headers })
          .then(response => {
            this.customers = response.data;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
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
  