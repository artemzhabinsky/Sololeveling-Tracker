function getAudioContext() {
  const Ctor = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
  return Ctor ? new Ctor() : null
}

function tone(ctx, { frequency, startTime, duration, type = 'sine', gain = 0.15 }) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, startTime)
  gainNode.gain.setValueAtTime(gain, startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(gainNode).connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playTaskComplete() {
  const ctx = getAudioContext()
  if (!ctx) return
  tone(ctx, { frequency: 880, startTime: ctx.currentTime, duration: 0.12, type: 'square' })
}

export function playLevelUp() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    tone(ctx, { frequency: freq, startTime: now + i * 0.08, duration: 0.3, type: 'triangle', gain: 0.12 })
  })
}
