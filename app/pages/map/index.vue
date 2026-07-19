<template>
  <v-container class="pa-4">
    <div class="d-flex align-center mb-4">
      <v-btn icon variant="text" to="/" class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h6 font-weight-medium">Map</h1>
    </div>
    
    <div ref="mapDiv" style="width: 100%; height: 500px; background: #e0e0e0; border-radius: 8px;"></div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapDiv = ref(null)

onMounted(async () => {
  if (process.client) {
    const L = await import('leaflet')
    
    // St. Nicolas College, San Fernando, Pampanga coordinates
    const lat = 15.0331
    const lng = 120.6944
    
    const map = L.map(mapDiv.value).setView([lat, lng], 17)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    
    // Marker with popup
    L.marker([lat, lng]).addTo(map)
      .bindPopup('<b>St. Nicolas College</b><br>San Fernando, Pampanga')
      .openPopup()
  }
})
</script>