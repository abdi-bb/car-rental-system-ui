<template>
  <div class="container mt-4">
    <h2>Customer Detail</h2>
    <div v-if="user" class="card">
      <div class="card-body">
        <p class="card-text"><strong>Username:</strong> {{ user.username }}</p>
        <p class="card-text"><strong>Email:</strong> {{ user.email }}</p>
        <p class="card-text"><strong>First Name:</strong> {{ user.first_name }}</p>
        <p class="card-text"><strong>Last Name:</strong> {{ user.last_name }}</p>
        <p class="card-text"><strong>Phone Number:</strong> {{ user.phone_number || 'N/A' }}</p>
      </div>
    </div>
    <div v-else class="alert alert-warning mt-3">
      <p class="mb-0">Customer not found</p>
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
    async fetchCustomerData() {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Authorization': `JWT ${accessToken}`,
        };

        const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/users/${this.$route.params.id}`, { headers });

        this.user = response.data;
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    },
  },
  created() {
    this.fetchCustomerData();
  },
};
</script>
