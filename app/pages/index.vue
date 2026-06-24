<template>
  <div style="text-align: center; margin-top: 50px;">
    <v-card >
    <v-avatar size="90"> 
      <v-img :src="user?.picture" />
    </v-avatar> 
    <h2>{{user?.name}} </h2>
    <h2>{{user?.email}} </h2>
    <v-btn>Submit</v-btn>
    <v-btn @click = "logout">Logout</v-btn>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth'
})

const user = ref<any>(null)
const showScanner =ref(false)
const scannedValued = ref('')

onMounted(() =>  {
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

<style>

</style>