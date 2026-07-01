<template>
  <div class="weather">
    <div class="bg" />

    <div class="content">
      <h1 class="city">{{ currentWeather?.location?.name || 'Loading...' }}</h1>
      <p class="date">{{ date }}</p>

      <div v-if="currentWeather?.current?.condition?.icon" class="icon-wrap">
        <img 
          :src="'https:' + currentWeather.current.condition.icon" 
          :alt="currentWeather.current.condition.text"
          class="icon" 
        />
      </div>

      <div class="temp">{{ Math.round(currentWeather?.current?.temp_c || 0) }}°</div>
      <p class="cond">{{ currentWeather?.current?.condition?.text || '' }}</p>
      <p class="feels">Feels like {{ Math.round(currentWeather?.current?.feelslike_c || 0) }}°</p>

      <div class="grid">
        <div class="card">
          <span class="label">Wind</span>
          <b class="value">{{ currentWeather?.current?.wind_kph || 0 }} km/h</b>
        </div>
        <div class="card">
          <span class="label">Humidity</span>
          <b class="value">{{ currentWeather?.current?.humidity || 0 }}%</b>
        </div>
        <div class="card">
          <span class="label">Pressure</span>
          <b class="value">{{ currentWeather?.current?.pressure_mb || 0 }} mb</b>
        </div>
        <div class="card">
          <span class="label">UV Index</span>
          <b class="value">{{ currentWeather?.current?.uv || 0 }}</b>
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
    const data = await $fetch('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: 'f2fc432aa31e4ace86c32508262906',
        q: 'Manila',
        aqi: 'no'
      }
    })
    currentWeather.value = data
  } catch (err) {
    console.error('Weather fetch failed:', err)
  }
}

const date = computed(() => {
  if (!currentWeather.value?.location?.localtime) return ''
  return new Date(currentWeather.value.location.localtime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
})

onMounted(() => {
  getWeatherData()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.weather {
  min-height: 100dvh;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
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
  background: rgba(0, 30, 60, 0.35);
}

.content {
  position: relative;
  z-index: 1;
  padding: 80px 20px 40px;
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
}

.city {
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 600;
  margin-bottom: 4px;
}

.date {
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  margin-bottom: 20px;
}

.icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: -10px;
}

.icon {
  width: clamp(100px, 30vw, 140px);
  height: clamp(100px, 30vw, 140px);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.temp {
  font-size: clamp(3.5rem, 12vw, 5.5rem);
  font-weight: 200;
  line-height: 1;
  margin-bottom: 8px;
}

.cond {
  font-size: clamp(1rem, 3vw, 1.2rem);
  margin-bottom: 4px;
}

.feels {
  color: rgba(255, 255, 255, 0.75);
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  margin-bottom: 32px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: clamp(0.95rem, 3vw, 1.1rem);
  font-weight: 600;
}

@media (min-width: 768px) {
  .content {
    padding-top: 100px;
  }
  
  .grid {
    gap: 16px;
  }
  
  .card {
    padding: 20px;
  }
}
</style>