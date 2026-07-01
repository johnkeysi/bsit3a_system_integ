<template>
  <div class="weather">
    <div class="bg" />

    <div class="content">
      <h1 style="font-size: 1.6rem; margin: 0;">{{ w?.location?.name }}</h1>
      <p style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin: 4px 0 12px;">{{ date }}</p>

      <img v-if="w?.current?.condition" :src="'https:' + w.current.condition.icon" style="width: 120px; height: 120px;" />
      <div style="font-size: 4.5rem; font-weight: 200; line-height: 1;">{{ Math.round(w?.current?.temp_c || 0) }}°</div>
      <p>{{ w?.current?.condition?.text }}</p>
      <p style="color: rgba(255,255,255,0.7); margin-bottom: 24px;">Feels like {{ Math.round(w?.current?.feelslike_c || 0) }}°</p>

      <!-- Hourly -->
      <div style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 12px;">
          <span>Today</span>
          <span>{{ today }}</span>
        </div>
        <div style="display: flex; gap: 20px; overflow-x: auto;">
          <div v-for="h in hours" :key="h.time" style="display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 50px;">
            <b>{{ Math.round(h.temp_c) }}°</b>
            <img :src="'https:' + h.condition.icon" style="width: 40px; height: 40px;" />
            <span style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">{{ h.time.slice(11, 16) }}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div v-for="s in stats" :key="s.l" style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6); text-transform: uppercase;">{{ s.l }}</span>
          <b style="font-size: 1.1rem;">{{ s.v }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const w = ref(null)

onMounted(async () => {
  w.value = await $fetch('https://api.weatherapi.com/v1/forecast.json', {
    params: { key: 'f2fc432aa31e4ace86c32508262906', q: 'Manila', days: 1, aqi: 'no', alerts: 'no' }
  })
})

const date = computed(() => w.value ? new Date(w.value.location.localtime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '')
const today = computed(() => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }))
const hours = computed(() => w.value ? w.value.forecast.forecastday[0].hour.filter(h => new Date(h.time) >= new Date()).slice(0, 6) : [])

const stats = computed(() => w.value ? [
  { l: 'Wind', v: w.value.current.wind_kph + ' km/h' },
  { l: 'Humidity', v: w.value.current.humidity + '%' },
  { l: 'Pressure', v: w.value.current.pressure_mb + ' mb' },
  { l: 'UV', v: w.value.current.uv }
] : [])
</script>

<style scoped>
.weather {
  min-height: 100dvh;
  color: white;
  font-family: system-ui, sans-serif;
}

.bg {
  position: fixed;
  inset: 0;
  background: url('/images/weather.jpg') center/cover;
  z-index: 0;
}

.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 30, 60, 0.35);
}

.content {
  position: relative;
  z-index: 1;
  padding: 60px 20px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}
</style>