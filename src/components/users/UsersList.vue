<template>
  <div class="mt-24">
    <h1 class="font-bold font-size-75">Customers List</h1>

    <!-- Success and error messages -->
    <div v-if="successMessage" class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
      <div class="flex items-center justify-between">
        <span>{{ successMessage }}</span>
        <button @click="clearMessages" class="text-green-700 hover:text-green-900 focus:outline-none">
          X
        </button>
      </div>
    </div>
    <div v-if="errorMessage" class="md:w-2/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button @click="clearMessages" class="text-red-700 hover:text-red-900 focus:outline-none">
          X
        </button>
      </div>
    </div>

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
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const users = ref([]);

  const isStaff = computed(() => store.state.isStaff);

  const accessToken = localStorage.getItem('accessToken');

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  
  const successMessage = ref(route.query.successMessage);
  const errorMessage = ref(route.query.errorMessage);

  const fetchData = async () => {
    try {

      const headers = {
        'Authorization': `JWT ${accessToken}`,
      };

      const response = await axios.get(`${BASE_API_URL}/auth/users/`, { headers });
      users.value = response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        errorMessage.value = 'You are not authorized to view this page.';
        router.push({ name: 'CarsList', query: { errorMessage: errorMessage.value } });
      } else {
        console.error('Error fetching data:', error);
        errorMessage.value = 'Error fetching data';
        router.push({ name: 'CarsList', query: { errorMessage: errorMessage.value } });
      }
    }
  };

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';

    router.replace({ query: {} });
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
