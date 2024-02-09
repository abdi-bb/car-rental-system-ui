<template>
  <!-- Login Form -->
  <div class="bg-gray-100 p-8 rounded-md shadow-md w-1/3 md:w-2/3 mt-24 h-full md:h-2/3 mx-auto max-w-md">
    <form>
      <h2
        class="text-2xl font-semibold mb-4 col-span-full flex items-center justify-between"
      >
        Login
      </h2>

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

      <div class="mb-4">
        <label for="username" class="block text-gray-700">Username</label>
        <input
          type="text"
          id="username"
          v-model="loginData.username"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !loginData.username"
        />
        <!-- Error message for username -->
        <p v-if="formSubmitted && !loginData.username" class="text-red-500">
          Username is required
        </p>
      </div>

      <div class="mb-4">
        <label for="password" class="block text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          v-model="loginData.password"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !loginData.password"
        />
        <!-- Error message for password -->
        <p v-if="formSubmitted && !loginData.password" class="text-red-500">
          Password is required
        </p>
      </div>

      <button
        @click.prevent="login"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
      <!-- Toggle to Register -->
      <p class="mt-4 text-sm">
        Don't have an account?
        <router-link to="/register" class="text-blue-500"
          >
          Register
        </router-link>
        <!-- <a @click="showRegisterForm" href="#" class="text-blue-500"
          >Register</a
        > -->
      </p>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const store = useStore();
const route = useRoute();
const router = useRouter();

const loginData = reactive({
  username: '',
  password: '',
});

const formSubmitted = ref(false);
const loginError = ref('');

const successMessage = ref(route.query.successMessage || '');
const errorMessage = ref(route.query.errorMessage || '');

const isAuthenticated = computed(() => store.state.isAuthenticated);
const isStaff = computed(() => store.state.isStaff);
const isAdmin = computed(() => isAuthenticated.value && isStaff.value);

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

const login = async () => {
  try {
    formSubmitted.value = true;
    if (!loginData.username || !loginData.password) {
      errorMessage.value = 'Username and password are required';
      return;
    }

    const response = await axios.post(
      `${BASE_API_URL}/auth/jwt/create/`,
      loginData
    );

    if (response.status === 200) {
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      const username = loginData.username;

      const headers = {
        Authorization: `JWT ${accessToken}`,
      };

      const userIdResponse = await axios.get(
        `${BASE_API_URL}/auth/users/?search=${username}`,
        { headers }
      );

      const userData = userIdResponse.data;
      const userId = userData[0].id;

      store.commit('setAuthentication', {
        isAuthenticated: true,
        accessToken,
        refreshToken,
        username,
      });
      store.commit('setUserId', userId);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);

      successMessage.value = 'Login successful';
      errorMessage.value = '';
      router.push({ name: 'Home' });
    } else {
      errorMessage.value = 'Invalid username or password';
    }
  } catch (error) {
    errorMessage.value = 'Error logging in. Please try again.';
  }
};

const clearMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';

  router.replace({ query: {} });
};

</script>

<style>

</style>