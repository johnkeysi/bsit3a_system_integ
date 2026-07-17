<script setup lang="ts">
definePageMeta({ layout: 'birthday' })

const sections = ['landing', 'letter', 'gallery', 'timeline', 'gift', 'ending'] as const
type Section = typeof sections[number]
const currentSection = ref<Section>('landing')

function next() {
  const i = sections.indexOf(currentSection.value)
  if (i < sections.length - 1) currentSection.value = sections[i + 1]
}

function restart() {
  currentSection.value = 'landing'
}

// MUSIC
const playing = ref(false)
let audio: HTMLAudioElement | null = null
function ensureAudio() {
  if (!import.meta.client) return null
  if (!audio) {
    audio = new Audio('/images/music.mp3')
    audio.loop = true
    audio.volume = 0.6
  }
  return audio
}
function startMusic() {
  const a = ensureAudio()
  if (!a) return
  a.play().then(() => { playing.value = true }).catch(() => { playing.value = false })
}
function toggleMusic() {
  const a = ensureAudio()
  if (!a) return
  if (playing.value) { a.pause(); playing.value = false } else { startMusic() }
}

// LETTER
const fullMessage = `It's amazing how a simple game introduced me to such a wonderful friend.

All those weekends playing Blood Strike and other games together became some of my favorite memories.

Thank you for always being so kind, patient, and fun to play with.

I hope your special day is filled with happiness, laughter, and everything that makes you smile.

And I hope our friendship continues for many more years — more games, more laughs, and more memories together.

Stay awesome, stay happy, never change.

-Keyotoshi`

const titleText = "Happy Birthday, Way! 🎂"
const typedTitle = ref("")
const typedBody = ref("")
const done = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function typeTitle(i = 0) {
  if (i < titleText.length) {
    typedTitle.value += titleText[i]
    timer = setTimeout(() => typeTitle(i + 1), 45)
  } else {
    timer = setTimeout(() => typeBody(0), 600)
  }
}

function typeBody(i = 0) {
  if (i >= fullMessage.length) { done.value = true; return }
  typedBody.value += fullMessage[i]
  const delay = fullMessage[i] === '\n' ? 200 : 18
  timer = setTimeout(() => typeBody(i + 1), delay)
}

function skip() {
  if (timer) clearTimeout(timer)
  typedTitle.value = titleText
  typedBody.value = fullMessage
  done.value = true
}

// GALLERY
const photos = [
  { src: "/images/1.jpg.jfif", caption: "Blood Strike match 🎮" },
  { src: "/images/2.jpg.jfif", caption: "Weekend gaming ❤️" },
  { src: "/images/3.jpg.jfif", caption: "Sausage 🌭" },
  { src: "/images/4.jpg.jfif", caption: "Drop na Skyline HAHAHAHA" },
]
const active = ref<number | null>(null)
const broken = ref<number[]>([])
const current = computed(() => active.value === null ? null : photos[active.value])
const currentBroken = computed(() => active.value !== null && broken.value.includes(active.value))
function onError(i: number) { if (!broken.value.includes(i)) broken.value.push(i) }
function onErrorCurrent() { if (active.value !== null) onError(active.value) }
function open(i: number) { active.value = i }
function close() { active.value = null }
function prev() { if (active.value !== null) active.value = (active.value - 1 + photos.length) % photos.length }
function nextPhoto() { if (active.value !== null) active.value = (active.value + 1) % photos.length }

// TIMELINE
const memories = [
  { icon: "🎮", title: "The Day We Met", text: "A random Blood Strike match turned into something special." },
  { icon: "🤝", title: "Teammates to Friends", text: "Weekend after weekend, we kept playing together." },
  { icon: "😂", title: "Countless Laughs", text: "Epic fails, funny moments." },
  { icon: "❤️", title: "True Friendship", text: "You became one of the kindest friends I have ever known." },
  { icon: "🎂", title: "Today", text: "It's your special day. Happy Birthday, Way!" },
  { icon: "🚀", title: "The Future", text: "More games, more memories. See you this weekend!" },
]

// GIFT
const opening = ref(false)
const opened = ref(false)
async function openGift() {
  if (opening.value) return
  opening.value = true
  setTimeout(async () => {
    opened.value = true
    const confetti = (await import("canvas-confetti")).default
    confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } })
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 } }), 350)
  }, 900)
}

// ENDING
const hearts = [
  { left: "8%", delay: "0s", dur: "7s" },
  { left: "18%", delay: "2s", dur: "9s" },
  { left: "30%", delay: "1s", dur: "8s" },
  { left: "44%", delay: "3s", dur: "10s" },
  { left: "56%", delay: ".5s", dur: "7s" },
  { left: "68%", delay: "2.5s", dur: "9s" },
  { left: "80%", delay: "1.5s", dur: "8s" },
  { left: "92%", delay: "0s", dur: "10s" },
]
let raf: number | null = null
let stopConfetti = false
function startEndingConfetti() {
  import("canvas-confetti").then((mod) => {
    const confetti = mod.default
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } })
    const end = Date.now() + 5000
    const frame = () => {
      if (stopConfetti) return
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } })
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } })
      if (Date.now() < end) raf = requestAnimationFrame(frame)
    }
    frame()
  })
}

onMounted(() => { timer = setTimeout(() => typeTitle(), 700) })
onUnmounted(() => {
  if (timer) clearTimeout(timer)
  stopConfetti = true
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="page">
    <Transition name="fade" mode="out-in">
      
      <!-- LANDING -->
      <section v-if="currentSection === 'landing'" key="landing" class="landing">
        <div class="sky"></div>
        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>
        <span class="heart h1">❤️</span>
        <span class="heart h2">❤️</span>
        <span class="heart h3">❤️</span>
        <span class="heart h4">❤️</span>
        <div class="content">
          <img class="cat-img" src="/images/scuba.gif" alt="scuba">
          <h1>Happy Birthday, <span>Way</span></h1>
          <p>A little surprise made by your online friend.<br>Thank you for all the fun weekends, Blood Strike matches, and unforgettable gaming moments.</p>
          <div class="buttons">
            <button class="music" @click="toggleMusic">{{ playing ? '🔇 Mute' : '🎵 A Song Just For You' }}</button>
            <button class="start" @click="startMusic(); next()">🎁 Open Surprise</button>
          </div>
        </div>
      </section>

      <!-- LETTER -->
      <section v-else-if="currentSection === 'letter'" key="letter" class="letter">
        <div class="card">
          <h1>{{ typedTitle }}<span v-if="!done" class="cursor">|</span></h1>
          <pre class="msg">{{ typedBody }}<span v-if="!done" class="cursor">|</span></pre>
          <div class="actions">
            <button v-if="!done" class="skip" @click="skip">Skip »</button>
            <button v-else class="next" @click="next">See Our Memories →</button>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section v-else-if="currentSection === 'gallery'" key="gallery" class="gallery">
        <h1>📸 Our Memories</h1>
        <p class="sub">Click a photo to zoom</p>
        <div class="grid">
          <div v-for="(p, i) in photos" :key="i" class="polaroid" :style="{ '--r': (i % 2 === 0 ? '-3deg' : '3deg') }" @click="open(i)">
            <div class="photo">
              <img v-if="!broken.includes(i)" :src="p.src" :alt="p.caption" @error="onError(i)">
              <div v-else class="placeholder"><img src="/images/scuba.gif" alt="scuba" style="width:64px;height:64px;object-fit:contain;"></div>
            </div>
            <p>{{ p.caption }}</p>
          </div>
        </div>
        <button class="next" @click="next">Next →</button>
        <div v-if="current && active !== null" class="modal" @click.self="close">
          <button class="close" @click="close">✕</button>
          <button class="nav" @click.stop="prev">‹</button>
          <div class="zoom">
            <img v-if="!currentBroken" :src="current.src" :alt="current.caption" @error="onErrorCurrent">
            <div v-else class="placeholder big">🐱</div>
            <p>{{ current.caption }}</p>
          </div>
          <button class="nav" @click.stop="nextPhoto">›</button>
        </div>
      </section>

      <!-- TIMELINE -->
      <section v-else-if="currentSection === 'timeline'" key="timeline" class="timeline">
        <h1>🎮 Our Gaming Journey</h1>
        <div class="track">
          <div class="line"></div>
          <div v-for="(m, i) in memories" :key="i" class="item" :class="i % 2 === 0 ? 'left' : 'right'" :style="{ animationDelay: (i * 0.15) + 's' }">
            <div class="icon">{{ m.icon }}</div>
            <div class="card">
              <h3>{{ m.title }}</h3>
              <p>{{ m.text }}</p>
            </div>
          </div>
        </div>
        <button class="next" @click="next">One More Thing →</button>
      </section>

      <!-- GIFT -->
      <section v-else-if="currentSection === 'gift'" key="gift" class="gift-page">
        <h1 v-if="!opened">🎁 A Gift For You</h1>
        <p v-if="!opened" class="sub">{{ opening ? 'Opening...' : 'Click the gift to open it' }}</p>
        <div class="gift" :class="{ shake: opening && !opened, open: opened }" @click="openGift">
          <div class="bow">🎀</div>
          <div class="lid"></div>
          <div class="box"></div>
          <div class="ribbon"></div>
        </div>
        <div v-if="opened" class="message">
          <div class="emoji"><img src="/images/scuba.gif" alt="scuba" style="width:50px;height:50px;object-fit:contain;">💖</div>
          <h2>Surprise!</h2>
          <p>Thank you for being such an amazing friend, Way.<br>I hope this little website made you smile today.<br><br><strong>See you this weekend in Blood Strike! 🎮</strong></p>
          <button class="next" @click="next">One Last Surprise →</button>
        </div>
      </section>

      <!-- ENDING -->
      <section v-else-if="currentSection === 'ending'" key="ending" class="ending">
        <span v-for="(h, i) in hearts" :key="i" class="heart" :style="{ left: h.left, animationDelay: h.delay, animationDuration: h.dur }">❤️</span>
        <div class="content">
          <div class="cat"><img src="/images/scuba.gif" alt="scuba" style="width:70px;height:70px;object-fit:contain;">🎉</div>
          <h1>Happy Birthday, Way!</h1>
          <p>Thank you for being you.<br>Thank you for every game, every laugh, every memory.</p>
          <p class="bs">See you this weekend in Blood Strike! 🎮❤️</p>
          <button class="replay" @click="restart">🔄 Replay</button>
        </div>
      </section>

    </Transition>
  </div>
</template>

<style scoped>
/* ===== GLOBAL ===== */
.page { min-height: 100vh; }
.fade-enter-active, .fade-leave-active { transition: opacity .55s ease, transform .55s ease; }
.fade-enter-from { opacity: 0; transform: translateY(30px) scale(.98); }
.fade-leave-to { opacity: 0; transform: translateY(-30px) scale(.98); }

/* ===== LANDING ===== */
.landing { position: relative; width: 100%; min-height: 100vh; overflow: hidden; display: flex; justify-content: center; align-items: center; }
.sky { position: absolute; inset: 0; background: linear-gradient(180deg, #8fd3ff 0%, #c8ecff 45%, #ffffff 100%); }
.landing .content { position: relative; z-index: 5; text-align: center; padding: 20px; max-width: 700px; }
.cat { font-size: 110px; animation: bounce 2s infinite; }
.cat-img { width: 120px; height: 120px; object-fit: contain; animation: bounce 2s infinite; }
.landing h1 { font-size: 60px; margin: 10px 0 15px; font-weight: 800; color: #243447; }
.landing h1 span { color: #ff4f91; }
.landing p { font-size: 21px; line-height: 1.8; color: #546e7a; margin-bottom: 35px; }
.buttons { display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; }
button { padding: 15px 34px; border: none; border-radius: 50px; font-size: 18px; cursor: pointer; transition: .3s; font-weight: 600; }
button:hover { transform: translateY(-5px); }
.music { background: white; color: #444; }
.start { background: #ff4f91; color: white; }
.cloud { position: absolute; background: white; border-radius: 100px; opacity: .95; }
.cloud::before { content: ""; position: absolute; width: 60px; height: 60px; background: white; border-radius: 50%; left: 20px; top: -25px; }
.cloud::after { content: ""; position: absolute; width: 80px; height: 80px; background: white; border-radius: 50%; right: 20px; top: -35px; }
.cloud1 { width: 180px; height: 60px; top: 12%; left: -200px; animation: cloudMove 40s linear infinite; }
.cloud2 { width: 220px; height: 70px; top: 35%; left: -260px; animation: cloudMove 55s linear infinite; }
.cloud3 { width: 150px; height: 55px; top: 60%; left: -180px; animation: cloudMove 32s linear infinite; }
.heart { position: absolute; font-size: 28px; animation: heartFloat linear infinite; }
.h1 { left: 10%; bottom: -40px; animation-duration: 8s; }
.h2 { left: 35%; bottom: -40px; animation-duration: 10s; }
.h3 { left: 70%; bottom: -40px; animation-duration: 7s; }
.h4 { left: 90%; bottom: -40px; animation-duration: 9s; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes cloudMove { from { transform: translateX(0); } to { transform: translateX(160vw); } }
@keyframes heartFloat { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-120vh); opacity: 0; } }

/* ===== LETTER ===== */
.letter { min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; background: linear-gradient(180deg, #fff0f6, #fde7f0); }
.letter .card { background: white; border-radius: 16px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
.letter h1 { font-size: 28px; color: #d6336c; margin-bottom: 20px; line-height: 1.3; }
.letter .msg { font-size: 16px; line-height: 1.8; color: #37474f; white-space: pre-wrap; word-wrap: break-word; margin: 0; font-family: inherit; }
.cursor { display: inline-block; margin-left: 2px; animation: blink .8s infinite; color: #d6336c; }
.actions { margin-top: 25px; text-align: center; }
.skip { background: transparent; border: 2px solid #d6336c; color: #d6336c; padding: 10px 26px; border-radius: 50px; font-size: 16px; cursor: pointer; }
.next { background: #ff4f91; color: white; border: none; padding: 14px 34px; border-radius: 50px; font-size: 18px; cursor: pointer; transition: .3s; }
.next:hover { transform: scale(1.06); }
@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

/* ===== GALLERY ===== */
.gallery { min-height: 100vh; background: linear-gradient(180deg, #e8f6ff, #fff); display: flex; flex-direction: column; align-items: center; padding: 60px 20px; }
.gallery h1 { font-size: 44px; color: #243447; }
.sub { color: #78909c; margin-top: 8px; }
.grid { display: flex; flex-wrap: wrap; gap: 28px; justify-content: center; max-width: 1000px; margin: 30px 0 40px; }
.polaroid { background: #fff; padding: 12px 12px 14px; border-radius: 6px; box-shadow: 0 8px 22px rgba(0,0,0,.15); transform: rotate(var(--r)); transition: .3s; cursor: pointer; width: 220px; }
.polaroid:hover { transform: rotate(0) translateY(-8px) scale(1.03); box-shadow: 0 16px 34px rgba(0,0,0,.22); }
.photo { width: 196px; height: 196px; background: #fbe9f1; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.photo img { width: 100%; height: 100%; object-fit: cover; }
.placeholder { font-size: 64px; }
.polaroid p { margin-top: 10px; font-size: 15px; color: #455a64; text-align: center; }
.modal { position: fixed; inset: 0; background: rgba(20,20,35,.82); display: flex; align-items: center; justify-content: center; gap: 20px; z-index: 99; animation: fadeIn .3s; }
.zoom { background: #fff; padding: 14px 14px 16px; border-radius: 8px; max-width: min(520px, 86vw); animation: zoomIn .35s ease; }
.zoom img { width: 100%; max-height: 60vh; object-fit: contain; border-radius: 4px; background: #fbe9f1; }
.zoom p { text-align: center; margin-top: 12px; color: #37474f; }
.placeholder.big { width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; font-size: 90px; background: #fbe9f1; border-radius: 4px; }
.nav { background: #fff; border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 26px; cursor: pointer; }
.close { position: absolute; top: 22px; right: 26px; background: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; font-size: 18px; cursor: pointer; }
@keyframes fadeIn { from { opacity: 0; } }
@keyframes zoomIn { from { opacity: 0; transform: scale(.85); } }

/* ===== TIMELINE ===== */
.timeline { min-height: 100vh; background: linear-gradient(180deg, #f3e8ff, #e8f3ff); padding: 70px 20px 60px; display: flex; flex-direction: column; align-items: center; }
.timeline h1 { font-size: 42px; color: #4a3b6b; }
.track { position: relative; width: min(860px, 94vw); margin: 40px 0 50px; }
.track .line { position: absolute; top: 0; bottom: 0; left: 50%; width: 4px; background: #d1b3ff; transform: translateX(-50%); border-radius: 4px; }
.item { position: relative; width: 50%; padding: 18px 45px; animation: fadeUp .7s ease both; }
.item.left { left: 0; text-align: right; }
.item.right { left: 50%; text-align: left; }
.icon { position: absolute; top: 24px; width: 52px; height: 52px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 6px 16px rgba(0,0,0,.15); z-index: 2; }
.item.left .icon { right: -26px; }
.item.right .icon { left: -26px; }
.timeline .card { background: #fff; border-radius: 14px; padding: 16px 20px; box-shadow: 0 8px 20px rgba(0,0,0,.10); display: inline-block; text-align: left; max-width: 320px; }
.timeline .card h3 { margin: 0 0 6px; color: #4a3b6b; font-size: 18px; }
.timeline .card p { margin: 0; color: #607d8b; font-size: 15px; line-height: 1.6; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* ===== GIFT ===== */
.gift-page { min-height: 100vh; background: linear-gradient(180deg, #fff6e8, #ffeef6); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px 20px; overflow: hidden; }
.gift-page h1 { font-size: 44px; color: #243447; }
.gift-page .sub { color: #90a4ae; margin-top: 10px; }
.gift { position: relative; width: 230px; height: 235px; cursor: pointer; margin-top: 30px; transition: transform .6s ease; }
.gift.open { transform: scale(.72); }
.box { position: absolute; bottom: 0; left: 15px; width: 200px; height: 150px; background: #ff4f91; border-radius: 12px; box-shadow: inset 0 -14px 0 rgba(0,0,0,.08); }
.lid { position: absolute; bottom: 150px; left: 0; width: 230px; height: 55px; background: #e84393; border-radius: 10px; transition: transform .8s ease, opacity .8s ease; transform-origin: left bottom; z-index: 2; }
.ribbon { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 34px; height: 205px; background: #ffd54f; z-index: 1; }
.bow { position: absolute; bottom: 200px; left: 50%; transform: translateX(-50%); font-size: 56px; z-index: 3; transition: transform .8s ease, opacity .8s ease; }
.gift.open .lid { transform: translateY(-160px) rotate(-28deg); opacity: 0; }
.gift.open .bow { transform: translate(-50%, -180px) rotate(25deg); opacity: 0; }
.gift.shake { animation: shake .8s ease; }
.gift-page .message { margin-top: 36px; background: #fff; border-radius: 20px; padding: 34px 44px; max-width: 560px; text-align: center; box-shadow: 0 18px 45px rgba(0,0,0,.16); animation: pop .6s ease; }
.emoji { font-size: 54px; }
.message h2 { color: #d6336c; margin: 10px 0; }
.message p { color: #546e7a; font-size: 18px; line-height: 1.8; }
@keyframes shake { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-5deg); } 40% { transform: rotate(5deg); } 60% { transform: rotate(-4deg); } 80% { transform: rotate(4deg); } }
@keyframes pop { from { opacity: 0; transform: scale(.7) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }

/* ===== ENDING ===== */
.ending { position: relative; min-height: 100vh; background: linear-gradient(180deg, #ffd6ec, #c9e7ff); display: flex; justify-content: center; align-items: center; overflow: hidden; padding: 30px 16px; }
.ending .heart { position: absolute; bottom: -40px; font-size: 26px; animation: float linear infinite; }
.ending .content { position: relative; z-index: 5; text-align: center; background: rgba(255,255,255,.45); backdrop-filter: blur(14px); border-radius: 28px; padding: 50px 60px; box-shadow: 0 18px 45px rgba(0,0,0,.14); animation: pop .7s ease; }
.ending .cat { font-size: 80px; animation: bounce 2s infinite; }
.ending h1 { font-size: 52px; color: #243447; margin: 15px 0; }
.ending p { font-size: 20px; color: #546e7a; line-height: 1.8; }
.bs { font-weight: 700; color: #d6336c; margin-top: 18px; }
.replay { margin-top: 28px; background: #ff4f91; color: white; border: none; padding: 14px 40px; border-radius: 50px; font-size: 18px; cursor: pointer; transition: .3s; }
.replay:hover { transform: scale(1.08); }
@keyframes float { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: .8; } 100% { transform: translateY(-110vh); opacity: 0; } }

/* ===== MOBILE ===== */
@media(max-width:768px) {
  .landing .cat { font-size: 80px; }
  .landing h1 { font-size: 42px; }
  .landing p { font-size: 17px; }
  .landing button { width: 100%; }
  .landing .buttons { flex-direction: column; }
  
  .letter .card { padding: 24px 20px; }
  .letter h1 { font-size: 22px; }
  .letter .msg { font-size: 15px; }
  
  .gallery h1 { font-size: 32px; }
  .nav { display: none; }
  
  .timeline h1 { font-size: 30px; }
  .track .line { left: 26px; }
  .item { width: 100%; left: 0 !important; text-align: left !important; padding: 14px 0 14px 64px; }
  .item .icon { left: 0 !important; right: auto !important; width: 44px; height: 44px; font-size: 20px; }
  
  .gift-page h1 { font-size: 32px; }
  .gift-page .message { padding: 26px 22px; }
  
  .ending h1 { font-size: 36px; }
  .ending .content { padding: 36px 26px; }
}
</style>