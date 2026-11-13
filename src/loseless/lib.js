/* Les quelques fonctions de l'outil Loseless dont ses composants ont besoin. */
export const initiales = (nom = '') =>
  nom.trim().split(/\s+/).slice(0, 2).map((m) => m[0]?.toUpperCase() || '').join('') || '·'

export const dollars = (n) => Math.round(Number(n) || 0).toLocaleString('fr-FR') + '\u202f$'
export const dollarsCourts = (n) => {
  const v = Number(n) || 0
  if (Math.abs(v) >= 1000) return `${(v / 1000).toLocaleString('fr-FR', { maximumFractionDigits: v >= 100000 ? 0 : 1 })} k$`
  return `${Math.round(v)} $`
}

export function traceLisse(pts) {
  const n = pts.length
  if (n === 0) return ''
  const f = (v) => v.toFixed(1)
  if (n < 3) return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join(' ')
  const dx = [], pente = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0])
    pente.push((pts[i + 1][1] - pts[i][1]) / (dx[i] || 1))
  }
  const t = pts.map((_, i) => (i === 0 ? pente[0] : i === n - 1 ? pente[n - 2] : pente[i - 1] * pente[i] <= 0 ? 0 : (pente[i - 1] + pente[i]) / 2))
  for (let i = 0; i < n - 1; i++) {
    if (pente[i] === 0) { t[i] = 0; t[i + 1] = 0; continue }
    const a = t[i] / pente[i], b = t[i + 1] / pente[i], s = a * a + b * b
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * pente[i]; t[i + 1] = k * b * pente[i] }
  }
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], u = dx[i] / 3
    d += ` C${f(x0 + u)},${f(y0 + t[i] * u)} ${f(x1 - u)},${f(y1 - t[i + 1] * u)} ${f(x1)},${f(y1)}`
  }
  return d
}
