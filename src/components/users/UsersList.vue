<template>
  <div>
    <h2>Customers List</h2>
    <table class="customer-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone Number</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.first_name || 'N/A'}}</td>
          <td>{{ user.last_name || 'N/A'}}</td>
          <td>{{ user.phone_number || 'N/A' }}</td>
          <td>
            <router-link :to="{ name: 'UserDetail', params: { id: user.id }}">
              Details
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
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
.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.customer-table th, .customer-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.customer-table th {
  background-color: #f2f2f2;
}

.customer-table tr:hover {
  background-color: #f5f5f5;
}

router-link {
  text-decoration: none;
  color: #0066cc;
  cursor: pointer;
}
</style>
