<template>
  <div class="container mx-auto mt-20 flex justify-center">
    <div class="flex flex-col flex-wrap pt-2 md:items-start w-full md:w-2/3">
      <h1
        class="md:w-full text-2xl mr-2 ml-2 font-semibold mb-3 text-center border-b pb-4 lg:text-left"
      >
        Manage Your Account
      </h1>

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

      <router-link to="/cars">
        <span
          class="py-8 px-1 text-lg md:text-sm text-blue-700 transition duration-300 mb-26 mr-2 ml-2"
          >Back to available cars</span
        >
      </router-link>

      <div class="border p-4 rounded-md mt-4 ml-2 mr-2 md:w-1/2">
        <div class="mb-4">
          <p class="mt-2 flex justify-between">
            <strong>Username:</strong> {{ targetUser.username }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>Email:</strong> {{ targetUser.email }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>First Name:</strong> {{ targetUser.first_name }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>Last Name:</strong> {{ targetUser.last_name }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>Phone Number:</strong> {{ targetUser.phone_number }}
          </p>
          <hr class="my-4" />
        </div>

        <button
          @click="deleteUser"
          class="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const targetUser = ref({});
  const userId = ref(route.params.userId);

  const successMessage = ref(route.query.successMessage);
  const errorMessage = ref(route.query.errorMessage);

  const accessToken = localStorage.getItem('accessToken');

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const fetchUserAccount = async () => {
    try {
      clearMessages();

      const headers = {
        'Authorization': `JWT ${accessToken}`,
      };
      const response = await axios.get(`${BASE_API_URL}/auth/users/${userId.value}`, { headers });

      if (response.status === 200) {
        targetUser.value = response.data;
      } else {
        errorMessage.value = "Failed to fetch targetUser account information";
        router.push({ name: "UserDetail", params: { userId: userId.value }, query: { errorMessage: errorMessage.value } });
    }
    } catch (error) {
      errorMessage.value = "Error during fetching targetUser account information";
      router.push({ name: "UserDetail", params: { userId: userId.value }, query: { errorMessage: errorMessage.value } });
    }
  };

  const deleteUser = async () => {
    try {
      clearMessages();

      const headers = {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${accessToken}`,
    };

    // Prompt the user for their current password
    const current_password = prompt("Please enter your password to confirm account deletion");
    const requestBody = {
      current_password: current_password,
    };

    const response = await axios.delete(`${BASE_API_URL}/auth/users/${userId.value}`, { headers, data: requestBody });

    if (response.status === 204) {
      successMessage.value = "Account deleted successfully";
      router.push({ name: "UsersList", query: { successMessage: successMessage.value } });
    } else {
      errorMessage.value = "Failed to delete account";
      router.push({ name: "UserDetail", params: { userId: userId.value }, query: { errorMessage: errorMessage.value } });
    }
    } catch (error) {
      errorMessage.value = "Error during deleting account try checking your password";
      router.push({ name: "UserDetail", params: { userId: userId.value }, query: { errorMessage: errorMessage.value } });
    }
  };

  const clearMessages = () => {
    successMessage.value = "";
    errorMessage.value = "";

    router.replace({ query: {} });
  };

  onMounted(async () => {
    await fetchUserAccount();
  });

</script>
