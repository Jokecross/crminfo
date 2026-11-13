/* ============================================================
   DONNÉES DE DÉMO
   Des partenaires et des ventes inventés, pour voir l'interface vivre.
   Rien ici ne vient de la vraie base. Le tirage est fixe (graine) :
   les mêmes chiffres à chaque chargement.
   ============================================================ */
import { NIVEAUX_DEPART, PLAN } from './reference.js'
import { ajouterJours, ecartJours, isoDuJour } from './format.js'

function graine(s) {
  return function () {
    s |= 0; s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const grilleDe = (code) => ({ ...NIVEAUX_DEPART.find((n) => n.code === code).grille })

export function creerDemo(aujourdhui = isoDuJour()) {
  const r = graine(44)
  const debut = ajouterJours(aujourdhui, -74)

  const profils = [
    { id: 'karim', nom: 'Karim B.', langue: 'AR · FR', niche: 'E-commerce', arrivee: 0, rythme: 26, conv: 0.03,
      contrats: [['demarrage', 0], ['confirme', 50]] },
    { id: 'diego', nom: 'Diego R.', langue: 'ES', niche: 'Business IA', arrivee: 6, rythme: 30, conv: 0.034,
      contrats: [['demarrage', 6], ['confirme', 34], ['elite', 62]] },
    { id: 'sofia', nom: 'Sofia K.', langue: 'EN', niche: 'Coaching', arrivee: 15, rythme: 18, conv: 0.026,
      contrats: [['demarrage', 15]] },
    { id: 'lena', nom: 'Lena M.', langue: 'DE', niche: 'Freelance', arrivee: 28, rythme: 14, conv: 0.024,
      contrats: [['demarrage', 28]] },
    { id: 'amira', nom: 'Amira H.', langue: 'AR', niche: 'Beauté', arrivee: 41, rythme: 16, conv: 0.022,
      contrats: [['demarrage', 41]] },
    { id: 'yanis', nom: 'Yanis T.', langue: 'FR', niche: 'Immobilier', arrivee: 63, rythme: 10, conv: 0.03,
      contrats: [['demarrage', 63]] },
  ]

  const partenaires = profils.map((p) => ({
    id: p.id,
    nom: p.nom,
    langue: p.langue,
    niche: p.niche,
    lien: p.id,
    depuis: ajouterJours(debut, p.arrivee),
    contrats: p.contrats.map(([niveau, j]) => ({ depuis: ajouterJours(debut, j), niveau, grille: grilleDe(niveau) })),
  }))

  const clics = []
  const ventes = []
  let n = 0
  for (const p of profils) {
    const total = ecartJours(debut, aujourdhui)
    for (let j = p.arrivee; j <= total; j++) {
      const date = ajouterJours(debut, j)
      const elan = 1 + ((j - p.arrivee) / 74) * 0.7
      const nb = Math.max(0, Math.round(p.rythme * elan * (0.55 + r() * 0.9)))
      clics.push({ date, partenaireId: p.id, nb })
      for (let c = 0; c < nb; c++) {
        if (r() > p.conv) continue
        const x = r()
        const plan = x < 0.55 ? 'builder_mensuel' : x < 0.8 ? 'starter_annuel' : 'builder_annuel'
        const age = total - j
        const y = r()
        const statut = age > 30 ? (y < 0.9 ? 'validee' : 'annulee')
          : age > 14 ? (y < 0.5 ? 'validee' : y < 0.92 ? 'attente' : 'annulee')
          : (y < 0.94 ? 'attente' : 'annulee')
        ventes.push({ id: 'v' + ++n, date, partenaireId: p.id, plan, statut, base44: PLAN[plan].base44 })
      }
    }
  }
  ventes.sort((a, b) => (a.date < b.date ? 1 : -1))

  // Un virement par partenaire le 5 de chaque mois, pour les ventes du
  // mois précédent validées à cette date.
  // Un virement par partenaire le 5 de chaque mois : tout ce qui est
  // validé depuis plus de 30 jours et pas encore payé.
  const paiements = []
  for (const p of partenaires) {
    const partDe = (v) => (([...p.contrats].reverse().find((k) => k.depuis <= v.date) || p.contrats[0]).grille[v.plan])
    let verse = 0
    let quand = ajouterJours(debut, 40).slice(0, 8) + '05'
    while (quand <= aujourdhui) {
      const du = ventes.filter((v) => v.partenaireId === p.id && v.statut === 'validee' && ecartJours(v.date, quand) > 30)
        .reduce((s, v) => s + partDe(v), 0)
      if (du - verse > 0) {
        paiements.push({ id: 'p' + paiements.length, partenaireId: p.id, date: quand, montant: du - verse })
        verse = du
      }
      quand = ajouterJours(quand, 32).slice(0, 8) + '05'
    }
  }

  return { partenaires, ventes, clics, paiements, niveaux: NIVEAUX_DEPART.map((x) => ({ ...x, grille: { ...x.grille } })) }
}
