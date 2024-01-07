<template>
  <footer class="bg-gray-200 text-black py-8 absolute w-full mt-20">
    <div
      class="container mx-auto text-center flex flex-col items-center justify-center h-full"
    >
      <p class="text-sm">&copy; 2024 WheelsOnRent. All rights reserved.</p>
      <div class="mt-2">
        <router-link to="#" class="text-black hover:text-green-500 mx-2"
          >About Us</router-link
        >
        <router-link to="#" class="text-black hover:text-green-500 mx-2"
          >Contact</router-link
        >
        <router-link to="#" class="text-black hover:text-green-500 mx-2"
          >Terms of Service</router-link
        >
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>
