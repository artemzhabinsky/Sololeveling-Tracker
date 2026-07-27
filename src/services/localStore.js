export function getItem(key, fallback) {
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
