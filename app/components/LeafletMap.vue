<template>
  <div ref="mapEl" style="height: 500px; width: 100%; border-radius: 8px;"></div>
</template>

<script setup>
// DON'T import leaflet here - use dynamic import inside onMounted
const mapEl = ref(null)

onMounted(async () => {
  // Only import Leaflet on client side
  const L = await import('leaflet')
  
  const melViLat = 15.0341
  const melViLng = 120.6947

  const map = L.map(mapEl.value).setView([melViLat, melViLng], 17)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)
  
  L.marker([melViLat, melViLng])
    .addTo(map)
    .bindPopup('St. Nicolas College')
    .openPopup()
})
</script>