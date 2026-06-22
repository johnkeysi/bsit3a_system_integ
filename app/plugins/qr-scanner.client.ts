import QrScanner from 'qr-scanner'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      qrScanner: QrScanner
    }
  }
})