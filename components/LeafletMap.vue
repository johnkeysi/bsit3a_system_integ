<template>
  <div ref="mapContainer" style="width: 100%; height: 500px; border-radius: 8px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapContainer = ref(null)

onMounted(async () => {
  if (process.client) {
    const L = await import('leaflet')
    
    const map = L.map(mapContainer.value).setView([14.5995, 120.9842], 13)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
  }
})
</script>