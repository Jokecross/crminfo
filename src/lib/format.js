const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
const pourcent = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })

export const usd = (n) => nombre.format(Math.round(n || 0)) + ' $'
export const entier = (n) => nombre.format(n || 0)
export const pct = (n) => pourcent.format(n || 0) + ' %'

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const MOIS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

export const dateCourte = (iso) => {
  const [, m, j] = iso.split('-')
  return `${+j} ${MOIS[+m - 1]}`
}
export const dateLongue = (iso) => {
  const [a, m, j] = iso.split('-')
  return `${+j} ${MOIS_LONG[+m - 1]} ${a}`
}
export const moisLong = (iso) => MOIS_LONG[+iso.split('-')[1] - 1]

/* Les dates circulent en texte AAAA-MM-JJ : pas de fuseau qui décale un jour. */
export const isoDuJour = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}
export const ajouterJours = (iso, n) => {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return isoDuJour(d)
}
export const ecartJours = (a, b) =>
  Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5)

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
export const jourLong = (iso) => `${JOURS[new Date(iso + 'T12:00:00').getDay()]} ${dateLongue(iso)}`
