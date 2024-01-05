<template>
  <div class="container mt-5">
    <div class="border rounded p-4 bg-light">
      <h2>User Registration</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="username" class="form-label">Username:</label>
          <input type="text" id="username" v-model="userData.username" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input type="email" id="email" v-model="userData.email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input type="password" id="password" v-model="userData.password" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name:</label>
          <input type="text" id="firstName" v-model="userData.firstName" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name:</label>
          <input type="text" id="lastName" v-model="userData.lastName" class="form-control" required />
        </div>
        <div class="mb-3">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>
      <p v-if="registrationMessage" class="mt-3 alert alert-info">{{ registrationMessage }}</p>
    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        userData: {
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        },
        registrationMessage: '',
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/auth/users/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.userData),
          });
  
          if (!response.ok) {
            throw new Error('Failed to register user');
          }


          this.registrationMessage = 'User registered successfully';
          this.$router.push('/login');
        } catch (error) {
          console.error('Error registering user:', error);
          this.registrationMessage = 'Error registering user. Please try again.';
        }
      },
    },
  };
  </script>

  <style>
  </style>
  