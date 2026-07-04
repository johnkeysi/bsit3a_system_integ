import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'

export default defineNuxtPlugin(async () => {
  const model = await cocoSsd.load()
  console.log('✅ COCO-SSD model loaded!')

  return {
    provide: {
      objectDetector: {
        model,
        detect: async (videoElement: HTMLVideoElement) => {
          return await model.detect(videoElement)
        },
        drawDetections: (canvas: HTMLCanvasElement, predictions: any[]) => {
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          ctx.clearRect(0, 0, canvas.width, canvas.height)

          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

          predictions.forEach((prediction, index) => {
            const [x, y, width, height] = prediction.bbox
            const color = colors[index % colors.length]

            ctx.strokeStyle = color
            ctx.lineWidth = 3
            ctx.strokeRect(x, y, width, height)

            const label = `${prediction.class} ${(prediction.score * 100).toFixed(0)}%`
            ctx.font = 'bold 16px sans-serif'
            const textWidth = ctx.measureText(label).width

            ctx.fillStyle = color
            ctx.fillRect(x, y - 32, textWidth + 12, 28)

            ctx.fillStyle = '#ffffff'
            ctx.fillText(label, x + 6, y - 12)
          })
        }
      }
    }
  }
})