<template>
  <div class="weather">
    <div class="bg" />

    <div class="content">
      <h1 style="font-size: 2rem; margin: 0;">{{ w?.location?.name }}</h1>
      <p style="color:black; font-size: 1rem;">{{ date }}</p>

      <img v-if="w?.current?.condition" :src="'https:' + w.current.condition.icon" style="width: 150px; height: 150px;" />
      <div style="font-size: 3.5rem; font-weight: 200;">{{(w?.current?.temp_c || 0) }}°</div>
      <p>{{ w?.current?.condition?.text }}</p>
      <p style="color: black;">Feels like {{(w?.current?.feelslike_c || 0) }}°</p>

      <!-- Hourly -->
      <div style="background: rgba(255,255,255,0.5); border-radius: 20px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 12px;">
          <span>Today</span>
          <span>{{ today }}</span>
        </div>
        <div style="display: flex; gap: 20px; overflow-x: auto;">
          <div v-for="h in hours" :key="h.time" style="display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 50px;">
            <b>{{ (h.temp_c) }}°</b>
            <img :src="'https:' + h.condition.icon" />
            <span style="font-size: 0.8rem; color:black;">{{ h.time.slice(11, 16) }}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
  
    </div>
  </div>
</template>

<script setup>
const w = ref(null)

onMounted(async () => {
  w.value = await $fetch('http://api.weatherapi.com/v1/forecast.json?key=f2fc432aa31e4ace86c32508262906&q=Manila&days=7&aqi=no&alerts=no')
})

const date = computed(() => w.value ? new Date(w.value.location.localtime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '')
const today = computed(() => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }))
const hours = computed(() => w.value ? w.value.forecast.forecastday[0].hour.filter(h => new Date(h.time) >= new Date()).slice(0, 6) : [])
</script>

<style scoped>


.bg {
  position: fixed;
  inset: 0;
  background: url('/images/weather.jpg') center/cover;
  z-index: 0;
}

.content {
  position: relative;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
}
</style>