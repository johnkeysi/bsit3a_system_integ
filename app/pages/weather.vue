<template>
  <div class="weather">
    <div class="bg" />

    <div class="content">
      <h1>{{ currentWeather?.location?.name }}</h1>
      <p class="date">{{ date }}</p>

      <img 
        v-if="currentWeather?.current?.condition?.icon"
        :src="'https:' + currentWeather.current.condition.icon" 
        class="icon" 
      />
      <div class="temp">{{ Math.round(currentWeather?.current?.temp_c || 0) }}°</div>
      <p class="cond">{{ currentWeather?.current?.condition?.text }}</p>
      <p class="feels">Feels like {{ Math.round(currentWeather?.current?.feelslike_c || 0) }}°</p>

      <div class="grid">
        <div class="card">
          <span>Wind</span>
          <b>{{ currentWeather?.current?.wind_kph }} km/h</b>
        </div>
        <div class="card">
          <span>Humidity</span>
          <b>{{ currentWeather?.current?.humidity }}%</b>
        </div>
        <div class="card">
          <span>Pressure</span>
          <b>{{ currentWeather?.current?.pressure_mb }} mb</b>
        </div>
        <div class="card">
          <span>UV</span>
          <b>{{ currentWeather?.current?.uv }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//@ts-nocheck
definePageMeta({
  layout: 'weatherapp',
  middleware: 'auth'
})

const currentWeather = ref(null)

const getWeatherData = async () => {
  try {
    const data = await $fetch('http://api.weatherapi.com/v1/current.json?key=f2fc432aa31e4ace86c32508262906&q=Manila&aqi=no', {  
    })
    currentWeather.value = data
    console.log(data)
  } catch (err) {
    console.error('Failed to fetch data', err)
  }
}

const date = computed(() => {
  if (!currentWeather.value?.location?.localtime) return ''
  return new Date(currentWeather.value.location.localtime).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  })
})

onMounted(getWeatherData)
</script>

<style scoped>
.weather {
  min-height: 100vh;
  color: white;
  font-family: system-ui, sans-serif;
}

.bg {
  position: fixed;
  inset: 0;
  background: url('/images/weather.jpg') center/cover no-repeat;
  z-index: 0;
}

.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 40, 100, 0.3);
}

.content {
  position: relative;
  z-index: 1;
  padding: 60px 24px 40px;
  text-align: center;
}

h1 {
  font-size: 1.8rem;
  margin: 0;
}

.date {
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
  margin: 4px 0 20px;
}

.icon {
  width: 120px;
  height: 120px;
}

.temp {
  font-size: 5rem;
  font-weight: 300;
  line-height: 1;
}

.cond {
  font-size: 1.1rem;
  margin: 8px 0 4px;
}

.feels {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  margin-bottom: 32px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 360px;
  margin: 0 auto;
}

.card {
  background: rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card span {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
}

.card b {
  font-size: 1.1rem;
}
</style>