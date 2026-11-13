/* Tous les calculs de l'outil. Une règle : la part du partenaire est
   celle de SON contrat en vigueur le jour de la vente. Améliorer un
   contrat ne change rien aux ventes passées. */
import { ajouterJours, ecartJours } from './format.js'

export function contratA(p, date) {
  let c = p.contrats[0]
  for (const k of p.contrats) if (k.depuis <= date) c = k
  return c
}

/* Chaque vente reçoit sa part partenaire et sa marge. Une vente
   annulée ne rapporte rien et ne coûte rien. */
export function enrichir(data) {
  const parId = Object.fromEntries(data.partenaires.map((p) => [p.id, p]))
  return data.ventes.map((v) => {
    const p = parId[v.partenaireId]
    const c = contratA(p, v.date)
    const actif = v.statut !== 'annulee'
    const base44 = actif ? v.base44 : 0
    const part = actif ? c.grille[v.plan] : 0
    return { ...v, nom: p.nom, base44Net: base44, part, marge: base44 - part }
  })
}

export const PERIODES = [
  { code: '7j', label: '7 jours' },
  { code: '30j', label: '30 jours' },
  { code: 'mois', label: 'Ce mois' },
  { code: 'tout', label: 'Tout' },
]

export function bornes(code, aujourdhui) {
  if (code === '7j') return { du: ajouterJours(aujourdhui, -6), au: aujourdhui }
  if (code === '30j') return { du: ajouterJours(aujourdhui, -29), au: aujourdhui }
  if (code === 'mois') return { du: aujourdhui.slice(0, 8) + '01', au: aujourdhui }
  return { du: '2000-01-01', au: aujourdhui }
}
export const dans = (x, b) => x.date >= b.du && x.date <= b.au

export function totaux(ventes, clics = []) {
  const t = { ventes: 0, validees: 0, attente: 0, annulees: 0, base44: 0, part: 0, marge: 0, clics: 0 }
  for (const v of ventes) {
    if (v.statut === 'annulee') { t.annulees++; continue }
    t.ventes++
    if (v.statut === 'validee') t.validees++
    else t.attente++
    t.base44 += v.base44Net
    t.part += v.part
    t.marge += v.marge
  }
  for (const c of clics) t.clics += c.nb
  t.conversion = t.clics ? (t.ventes / t.clics) * 100 : 0
  t.tauxMarge = t.base44 ? (t.marge / t.base44) * 100 : 0
  return t
}

/* Ce qu'on doit à un partenaire : ses ventes validées, moins les virements
   déjà faits. Les ventes en attente sont montrées à part. */
export function soldes(pid, ventes, paiements) {
  let du = 0, attente = 0
  for (const v of ventes) {
    if (v.partenaireId !== pid) continue
    if (v.statut === 'validee') du += v.part
    if (v.statut === 'attente') attente += v.part
  }
  const mes = paiements.filter((p) => p.partenaireId === pid).sort((a, b) => (a.date < b.date ? 1 : -1))
  const paye = mes.reduce((s, p) => s + p.montant, 0)
  return { du, attente, paye, aPayer: Math.max(0, du - paye), dernier: mes[0] || null, paiements: mes }
}

export function parJour(ventes, clics, b) {
  const debut = b.du < '2001' ? [...ventes, ...clics].reduce((m, x) => (x.date < m ? x.date : m), b.au) : b.du
  const n = ecartJours(debut, b.au)
  const jours = []
  const index = {}
  for (let i = 0; i <= n; i++) {
    const date = ajouterJours(debut, i)
    index[date] = jours.length
    jours.push({ date, part: 0, marge: 0, base44: 0, ventes: 0, clics: 0 })
  }
  for (const v of ventes) {
    const j = jours[index[v.date]]
    if (!j || v.statut === 'annulee') continue
    j.part += v.part; j.marge += v.marge; j.base44 += v.base44Net; j.ventes++
  }
  for (const c of clics) {
    const j = jours[index[c.date]]
    if (j) j.clics += c.nb
  }
  return jours
}
