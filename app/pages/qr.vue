<!-- components/QrScanner.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const video = ref()
const result = ref('')
const status = ref('Ready')
const hasCamera = ref(false)
const hasFlash = ref(false)
const isFlashOn = ref(false)

let scanner = null
let isScanning = false

onMounted(async () => {
  const { default: QrScanner } = await import('qr-scanner')
  hasCamera.value = await QrScanner.hasCamera()
})

const start = async () => {
  if (!scanner) {
    const { default: QrScanner } = await import('qr-scanner')
    scanner = new QrScanner(
      video.value,
      (res) => {
        result.value = res.data
      },
      { returnDetailedScanResult: true }
    )
  }

  if (isScanning) return

  try {
    status.value = 'Requesting camera...'
    await scanner.start()
    isScanning = true
    status.value = 'Scanning'
    hasFlash.value = await scanner.hasFlash()
  } catch (err) {
    status.value = 'Error: ' + err.message
  }
}

const stop = async () => {
  if (!scanner || !isScanning) return
  await scanner.stop()
  isScanning = false
  status.value = 'Stopped'
  hasFlash.value = false
}

const toggleFlash = async () => {
  if (!scanner || !hasFlash.value) return
  isFlashOn.value ? await scanner.turnFlashOff() : await scanner.turnFlashOn()
  isFlashOn.value = !isFlashOn.value
}

onUnmounted(() => {
  scanner?.destroy()
})
</script>

<template>
  <div align="center">
    <h2>Scan from WebCam</h2>
    <p>Status: {{ status }}</p>
    <video ref="video" style="width: 100%; max-width: 400px; background: #000;"></video>
    <p>Camera: {{ hasCamera ? 'Yes' : 'No' }}</p>
    <p>QR: {{ result || 'None' }}</p>
    <button @click="start">Start</button>
    <button @click="stop">Stop</button>
    <button v-if="hasFlash" @click="toggleFlash">Flash {{ isFlashOn ? 'OFF' : 'ON' }}</button>
  </div>
</template>