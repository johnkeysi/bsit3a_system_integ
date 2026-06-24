<template>
  <div style="text-align: center; margin-top: 50px;">
    <h1>Welcome Back!</h1>
   <v-card style="max-width: 500px; margin: 50px auto; padding: 30px; border-radius: 30px;">
    <v-text-field
      label="Email"
      type="email"
      outlined
      style=" max-width: 500px; margin: 20px auto;"
    />
    
    <v-text-field
      label="Password"
      type="password"
      outlined
      style="max-width: 500px; margin: 20px auto;"
    />
    <v-btn block variant="tonal" color="primary" style="margin-top: 20px;">Login</v-btn>

    <h3>Or</h3>

    <v-btn
    block variant="elevated"
    color="red" 
    style="margin-top: 10px;"
    @click="loginWithGoogle"
    >Sign in with Google</v-btn>


    </v-card>
  </div>
  
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth'
})

//@ts-nocheck
const config = useRuntimeConfig()
declare global {
  interface Window {
    google:any
  }
}
const loginWithGoogle = () => {
const client = window.google.accounts.oauth2.initTokenClient({
  client_id: config.public.googleClientId,
  scope: 'openid email profile',
  callback: async (response:any) => {
    const userInfo = await $fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${response.access_token}`
      }
    })
    localStorage.setItem('google_user', JSON.stringify(userInfo))
    localStorage.setItem('google.token', response.access_token)

    navigateTo('')
  }
})
client.requestAccessToken()
}

</script>

<style>

</style>