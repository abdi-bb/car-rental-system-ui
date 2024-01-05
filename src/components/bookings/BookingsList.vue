<template>
    <div>
      <h2>Bookings List</h2>
      <ul>
        <li v-for="booking in bookings" :key="booking.id">
          <router-link :to="{ name: 'BookingDetail', params: { id: booking.id }}">
            {{ booking.customer.user.username }} - {{ booking.car.name }} - {{ booking.start_date }}
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  // Import axios library
  import axios from 'axios';
  
  export default {
    data() {
      return {
        bookings: [],
      };
    },
    methods: {
      fetchData() {
        axios.get('http://127.0.0.1:8000/api/v1/bookings')
          .then(response => {
            this.bookings = response.data;
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
  