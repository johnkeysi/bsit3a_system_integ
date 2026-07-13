<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="pa-8 text-center" max-width="380" elevation="1" rounded="lg">
      <!-- Loading -->
      <div v-if="!user">
        <v-progress-circular indeterminate color="grey" size="40"></v-progress-circular>
      </div>

      <!-- Profile -->
      <div v-else>
        <v-avatar size="90" class="mb-4">
          <v-img :src="user?.picture" cover />
        </v-avatar>

        <h2 class="text-h6 font-weight-medium mb-1">{{ user?.name }}</h2>
        <p class="text-body-2 text-grey-darken-1 mb-6">{{ user?.email }}</p>

        <v-divider class="mb-4"></v-divider>

        <div class="d-flex flex-column ga-2">
          <v-btn variant="text" to="/map" prepend-icon="mdi-map-marker-outline" class="justify-start">
            View Map
          </v-btn>

          <v-btn variant="text" to="/weather" prepend-icon="mdi-weather-partly-cloudy" class="justify-start">
            Weather
          </v-btn>

          <v-btn variant="text" to="/qr" prepend-icon="mdi-qrcode-scan" class="justify-start">
            Scan QR
          </v-btn>

          <v-btn variant="text" to="/object-detector" prepend-icon="mdi-eye" class="justify-start">
            Object Detector
          </v-btn>

          <v-divider class="my-2"></v-divider>

          <v-btn variant="text" @click="logout" prepend-icon="mdi-logout" color="grey-darken-1" class="justify-start">
            Log out
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
//@ts-nocheck
definePageMeta({
  middleware: 'auth'
})

const user = ref<any>(null)

onMounted(() => {
  const savedUser = localStorage.getItem('google_user')
  if (!savedUser) {
    navigateTo('/login')
    return
  }
  user.value = JSON.parse(savedUser)
})

const logout = () => {
  localStorage.removeItem('google_user')
  localStorage.removeItem('google_token')
  window.google?.accounts.id.disableAutoSelect()
  navigateTo('/login')
}

</script>