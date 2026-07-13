<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="pa-6 text-center" max-width="600" elevation="1" rounded="lg">
      <h2 class="text-h5 font-weight-medium mb-1">Object Detector</h2>
     

      <!-- Camera -->
      <div class="camera-wrapper mb-4">
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="camera-feed"
          :class="{ 'camera-active': isRunning }"
        />
        <canvas
          ref="canvasRef"
          class="detection-overlay"
          :class="{ 'canvas-active': isRunning }"
        />

        <div v-if="!isRunning && !isLoading" class="start-overlay">
          <v-icon size="48" color="white" class="mb-2">mdi-camera</v-icon>
          <p class="text-white text-body-2 mb-3">Camera is off</p>
          <v-btn color="primary" @click="startCamera" prepend-icon="mdi-camera">
            Start Camera
          </v-btn>
        </div>

        <div v-if="isLoading" class="start-overlay">
          <v-progress-circular indeterminate color="white" size="40" class="mb-2"></v-progress-circular>
          <p class="text-white text-body-2">Loading AI Model...</p>
          <p class="text-grey-lighten-1 text-caption">10-30 seconds on first load</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="d-flex justify-center ga-3 mb-4">
        <v-btn
          :color="isRunning ? 'error' : 'primary'"
          @click="toggleCamera"
          :prepend-icon="isRunning ? 'mdi-stop' : 'mdi-camera'"
          :disabled="isLoading"
        >
          {{ isRunning ? 'Stop' : 'Start' }}
        </v-btn>
        <v-btn variant="outlined" @click="switchCamera" prepend-icon="mdi-camera-flip" :disabled="!isRunning">
          Switch
        </v-btn>
      </div>

      <!-- Detected Objects -->
      <v-card v-if="filteredDetections.length > 0" variant="outlined" class="mb-4">
        <v-card-title class="text-subtitle-2 py-2 px-4 d-flex align-center">
          <v-icon size="18" class="mr-1">mdi-eye</v-icon>
          Detected ({{ filteredDetections.length }})
        </v-card-title>
        <v-list density="compact" class="py-0">
          <v-list-item v-for="obj in filteredDetections" :key="obj.class + obj.score" class="py-1">
            <template #prepend>
              <span class="text-h6">{{ getObjectEmoji(obj.class) }}</span>
            </template>
            <v-list-item-title class="text-body-2 text-capitalize">
              {{ obj.class }}
            </v-list-item-title>
            <template #append>
              <v-chip size="x-small" :color="getConfidenceColor(obj.score)" variant="tonal">
                {{ (obj.score * 100).toFixed(1) }}%
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <v-alert v-else-if="isRunning" type="info" variant="tonal" class="mb-4">
        No objects detected. Try pointing at a person, laptop, or bottle!
      </v-alert>

      <v-btn variant="text" to="/" prepend-icon="mdi-arrow-left" class="mt-2">
        Back to Profile
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
//@ts-nocheck
definePageMeta({ middleware: 'auth' })

const videoRef = ref(null)
const canvasRef = ref(null)
const isRunning = ref(false)
const isLoading = ref(false)
const detectedObjects = ref([])
const confidenceThreshold = ref(0.5)
const fps = ref(0)
const facingMode = ref('environment')

const { $objectDetector } = useNuxtApp()
let animationFrame = null
let stream = null
let lastTime = 0
let frameCount = 0

const objectEmojis = {
  person: '👤', bicycle: '🚲', car: '🚗', motorcycle: '🏍️', airplane: '✈️',
  bus: '🚌', train: '🚂', truck: '🚚', boat: '⛵', 'traffic light': '🚦',
  'fire hydrant': '🚒', 'stop sign': '🛑', bird: '🐦', cat: '🐱', dog: '🐕',
  horse: '🐴', sheep: '🐑', cow: '🐄', elephant: '🐘', bear: '🐻', zebra: '🦓',
  giraffe: '🦒', backpack: '🎒', umbrella: '☂️', handbag: '👜', tie: '👔',
  suitcase: '💼', frisbee: '🥏', skis: '⛷️', snowboard: '🏂', 'sports ball': '⚽',
  kite: '🪁', skateboard: '🛹', surfboard: '🏄', 'tennis racket': '🎾',
  bottle: '🍾', 'wine glass': '🍷', cup: '☕', fork: '🍴', knife: '🔪',
  spoon: '🥄', bowl: '🥣', banana: '🍌', apple: '🍎', sandwich: '🥪',
  orange: '🍊', broccoli: '🥦', carrot: '🥕', 'hot dog': '🌭', pizza: '🍕',
  donut: '🍩', cake: '🎂', chair: '🪑', couch: '🛋️', 'potted plant': '🪴',
  bed: '🛏️', 'dining table': '🍽️', toilet: '🚽', tv: '📺', laptop: '💻',
  mouse: '🖱️', remote: '📱', keyboard: '⌨️', 'cell phone': '📱', microwave: '📟',
  oven: '🔥', toaster: '🍞', sink: '🚰', refrigerator: '❄️', book: '📚',
  clock: '⏰', vase: '🏺', scissors: '✂️', 'teddy bear': '🧸',
  'hair drier': '💨', toothbrush: '🪥'
}

const getObjectEmoji = (className) => objectEmojis[className] || '🔍'
const getConfidenceColor = (score) => score >= 0.8 ? 'success' : score >= 0.5 ? 'warning' : 'error'
const filteredDetections = computed(() => detectedObjects.value.filter(obj => obj.score >= confidenceThreshold.value))

const startCamera = async () => {
  isLoading.value = true
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode.value, width: { ideal: 1280 }, height: { ideal: 720 } }
    })
    videoRef.value.srcObject = stream
    await new Promise(resolve => { videoRef.value.onloadedmetadata = resolve })
    canvasRef.value.width = videoRef.value.videoWidth
    canvasRef.value.height = videoRef.value.videoHeight
    isRunning.value = true
    isLoading.value = false
    detectFrame()
  } catch (err) {
    console.error('Camera error:', err)
    alert('Could not access camera. Please allow camera permissions.')
    isLoading.value = false
  }
}

const detectFrame = async () => {
  if (!isRunning.value) return
  const now = performance.now()
  frameCount++
  if (now - lastTime >= 1000) { fps.value = frameCount; frameCount = 0; lastTime = now }
  try {
    const predictions = await $objectDetector.detect(videoRef.value)
    detectedObjects.value = predictions
    $objectDetector.drawDetections(canvasRef.value, predictions)
  } catch (err) { console.error('Detection error:', err) }
  animationFrame = requestAnimationFrame(detectFrame)
}

const stopCamera = () => {
  isRunning.value = false
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (stream) stream.getTracks().forEach(track => track.stop())
  detectedObjects.value = []
  fps.value = 0
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

const toggleCamera = () => isRunning.value ? stopCamera() : startCamera()

const switchCamera = async () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  if (isRunning.value) { stopCamera(); await startCamera() }
}

onBeforeUnmount(() => stopCamera())
</script>

<style scoped>
.camera-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #1a1a2e;
  border-radius: 12px;
  overflow: hidden;
}
.camera-feed {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
}
.camera-active { opacity: 1; }
.detection-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.canvas-active { opacity: 1; }
.start-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(26, 26, 46, 0.9);
}
</style>