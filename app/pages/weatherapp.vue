<template>
  <div>
  <h1 >{{ currentWeather?.location?.name }}</h1>
  <h2>{{ currentWeather?.current?.temp_c }}C</h2>
  <p class="cond">{{ currentWeather?.current?.condition?.text }}</p>
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
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}
onMounted(getWeatherData)
</script>

<style>

</style>