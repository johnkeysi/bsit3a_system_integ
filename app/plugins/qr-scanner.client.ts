export default defineNuxtPlugin(async () => {
  const { default: QrScanner } = await import('qr-scanner')
  
  return {
    provide: {
      qrScanner: QrScanner
    }
  }
})