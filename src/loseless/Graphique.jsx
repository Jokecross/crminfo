import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { dollars, dollarsCourts, traceLisse } from './lib.js'

const EASE = [0.22, 1, 0.36, 1]

// Graduations « rondes » pour l'axe des montants.
function graduations(max) {
  if (max <= 0) return [0, 25, 50, 75, 100]
  const brut = max / 4
  const p = 10 ** Math.floor(Math.log10(brut))
  const pas = [1, 2, 2.5, 5, 10].map((x) => x * p).find((x) => x >= brut)
  return Array.from({ length: 5 }, (_, i) => i * pas)
}

/**
 * Courbe du CA. points = [{ cle, libelle, libelleCourt, ca, ventes, loseless, vide }]
 * Une seule série (le CA) : pas de légende, le titre de la carte la nomme.
 * valeur / format / formatAxe : pour tracer autre chose que le CA (visites, ventes…).
 */
const DETAILS = [['Ventes', (p) => p.ventes], ['Part Loseless', (p) => dollars(p.loseless)]]

export default function Graphique({ points, hauteur = 280, details = DETAILS, valeur = (p) => p.ca, format = (v) => dollars(v), formatAxe = dollarsCourts, titre = 'Évolution du chiffre d’affaires' }) {
  const ref = useRef(null)
  const [largeur, setLargeur] = useState(0)
  const [survol, setSurvol] = useState(null)

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setLargeur(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const m = { haut: 16, droite: 12, bas: 30, gauche: 52 }
  const w = Math.max(0, largeur - m.gauche - m.droite)
  const h = hauteur - m.haut - m.bas
  const ticks = graduations(Math.max(0, ...points.map(valeur)))
  const top = ticks[ticks.length - 1] || 1
  const x = (i) => m.gauche + (points.length > 1 ? (i / (points.length - 1)) * w : w / 2)
  const y = (v) => m.haut + h - (v / top) * h

  const pleins = points.map((p, i) => ({ ...p, i })).filter((p) => !p.vide)
  // La courbe se redessine quand les données changent (pas quand la largeur change).
  const signature = `${points.length}-${points[0]?.cle}-${points.at(-1)?.cle}-${Math.round(points.reduce((a, p) => a + valeur(p), 0))}`
  const trace = traceLisse(pleins.map((p) => [x(p.i), y(valeur(p))]))
  const aire = pleins.length > 1 ? `${trace} L${x(pleins.at(-1).i).toFixed(1)},${y(0)} L${x(pleins[0].i).toFixed(1)},${y(0)} Z` : ''

  // Au plus ~7 libellés, comptés depuis le dernier point : la date la plus récente est toujours lisible.
  const tous = Math.max(1, Math.ceil(points.length / (largeur < 420 ? 3 : largeur < 620 ? 4 : 7)))
  const avecLibelle = (i) => (points.length - 1 - i) % tous === 0

  const bouger = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = e.clientX - r.left
    const i = Math.round(((px - m.gauche) / (w || 1)) * (points.length - 1))
    setSurvol(Math.min(points.length - 1, Math.max(0, i)))
  }

  const s = survol != null ? points[survol] : null
  const gaucheBulle = s ? Math.min(Math.max(x(survol) - 90, 0), largeur - 180) : 0

  return (
    <div ref={ref} className="relative select-none" style={{ height: hauteur }} onMouseMove={bouger} onMouseLeave={() => setSurvol(null)}>
      {largeur > 0 && (
        <svg width={largeur} height={hauteur} className="block" role="img" aria-label={titre}>
          <defs>
            <linearGradient id="degradeCA" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#121212" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#121212" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.gauche} x2={largeur - m.droite} y1={y(t)} y2={y(t)} stroke="#E6E2DA" strokeDasharray={t ? '2 4' : ''} />
              <text x={m.gauche - 10} y={y(t)} dy="0.32em" textAnchor="end" className="tabular fill-pierre text-[11px]">{formatAxe(t)}</text>
            </g>
          ))}
          {points.map((p, i) => avecLibelle(i) && (
            <text key={p.cle} x={x(i)} y={hauteur - 8} textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'} className="fill-pierre text-[11px]">{p.libelleCourt}</text>
          ))}
          {aire && <motion.path key={`a-${signature}`} d={aire} fill="url(#degradeCA)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.35 }} />}
          {trace && (
            <motion.path
              key={`l-${signature}`} d={trace} fill="none" stroke="#121212" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: EASE }}
            />
          )}
          {pleins.length === 1 && <circle cx={x(pleins[0].i)} cy={y(valeur(pleins[0]))} r="4" fill="#121212" />}
          {s && (
            <>
              <motion.line animate={{ x1: x(survol), x2: x(survol) }} transition={{ type: 'spring', stiffness: 700, damping: 50 }} y1={m.haut} y2={m.haut + h} stroke="#121212" strokeOpacity="0.2" strokeDasharray="3 3" />
              {!s.vide && <motion.circle animate={{ cx: x(survol), cy: y(valeur(s)) }} transition={{ type: 'spring', stiffness: 700, damping: 50 }} r="5.5" fill="#121212" stroke="#fff" strokeWidth="2.5" />}
            </>
          )}
        </svg>
      )}
      {s && (
        <motion.div
          className="pointer-events-none absolute top-0 z-10 w-[180px] rounded-2xl bg-encre px-3.5 py-3 text-papier shadow-[0_18px_40px_-16px_rgba(18,18,18,0.7)]"
          initial={{ opacity: 0, left: gaucheBulle, y: 6 }} animate={{ opacity: 1, left: gaucheBulle, y: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 45 }}
        >
          <div className="text-[11px] text-papier/60">{s.libelle}</div>
          {s.vide ? (
            <div className="mt-1 text-sm text-papier/70">Pas encore de données</div>
          ) : (
            <>
              <div className="tabular mt-0.5 text-lg font-extrabold">{format(valeur(s))}</div>
              <div className="mt-1.5 space-y-0.5 text-xs text-papier/70">
                {details.map(([l, f]) => <div key={l} className="flex justify-between"><span>{l}</span><span className="tabular text-papier">{f(s)}</span></div>)}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
