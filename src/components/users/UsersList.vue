<template>
  <div class="mt-24">
    <h1 class="font-bold font-size-75">Customers List</h1>
    <table class="customer-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone Number</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.first_name || 'N/A'}}</td>
          <td>{{ user.last_name || 'N/A'}}</td>
          <td>{{ user.phone_number || 'N/A' }}</td>
          <td>
            <router-link :to="{ name: 'UserDetail', params: { userId: user.id }}">
              Details
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { computed, defineProps, onMounted, reactive, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const users = ref([]);

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const isStaff = computed(() => store.state.isStaff);
  
  const successMessage = ref(route.query.successMessage);
  const errorMessage = ref(route.query.errorMessage);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': `JWT ${accessToken}`,
      };

      const response = await axios.get(`${BASE_API_URL}/auth/users/`, { headers });
      users.value = response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        errorMessage.value = 'You are not authorized to view this page.';
      } else {
        console.error('Error fetching data:', error);
        errorMessage.value = 'Error fetching data';
      }
    }
  };

  onMounted(async () => {
    await fetchData();
  });

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
