import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion } from 'motion/react'
import { initiales, traceLisse } from './lib.js'
import { t } from './langue.js'

// Courbe d'animation de la marque (même que la landing) et ressort des éléments qui bougent.
export const EASE = [0.22, 1, 0.36, 1]
export const RESSORT = { type: 'spring', stiffness: 420, damping: 36, mass: 0.9 }
export const Presence = AnimatePresence

export function Symbole({ className = 'h-7 w-7', encre = '#121212' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="4 4 92 92" className={className} aria-hidden="true">
      <defs>
        <mask id={`coupure-${id}`}>
          <rect x="0" y="0" width="100" height="100" fill="#fff" />
          <circle cx="76.9" cy="23.1" r="16" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="38" fill="none" stroke={encre} strokeWidth="16" mask={`url(#coupure-${id})`} />
      <circle cx="76.9" cy="23.1" r="13" fill="#D2401C" />
    </svg>
  )
}

// Le symbole qui se trace : l'anneau se dessine, puis le point arrive.
export function SymboleAnime({ className = 'h-12 w-12', encre = '#121212', boucle = false }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="4 4 92 92" className={className} aria-hidden="true">
      <defs>
        <mask id={`coupure-a-${id}`}>
          <rect x="0" y="0" width="100" height="100" fill="#fff" />
          <circle cx="76.9" cy="23.1" r="16" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#coupure-a-${id})`}>
        <motion.circle
          cx="50" cy="50" r="38" fill="none" stroke={encre} strokeWidth="16"
          transform="rotate(-45 50 50)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: EASE, repeat: boucle ? Infinity : 0, repeatType: 'reverse', repeatDelay: 0.3 }}
        />
      </g>
      <motion.circle
        cx="76.9" cy="23.1" r="13" fill="#D2401C"
        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: '76.9px 23.1px' }}
        transition={{ delay: 0.75, type: 'spring', stiffness: 500, damping: 18 }}
      />
    </svg>
  )
}

const TRACES = {
  plus: 'M12 5v14M5 12h14',
  fermer: 'M6 6l12 12M18 6L6 18',
  gauche: 'M15 18l-6-6 6-6',
  droite: 'M9 18l6-6-6-6',
  bas: 'M6 9l6 6 6-6',
  horloge: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  lien: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  copier: 'M9 9h10v10H9zM5 15V5h10',
  fleche: 'M5 12h14M13 6l6 6-6 6',
  recherche: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
  coche: 'M5 12.5l4.5 4.5L19 7.5',
  lecture: 'M8 5v14l11-7L8 5Z',
  corbeille: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  calendrier: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  personne: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  telephone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5',
  video: 'M4 6h11v12H4zM15 10l5-3v10l-5-3',
  bulle: 'M4 5h16v11H9l-5 4V5Z',
  bouclier: 'M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z',
  fusee: 'M12 15l-3-3c1-4 4-8 10-9-1 6-5 9-9 10ZM9 12l-4 1 2-4M12 15l-1 4 4-2',
  modifier: 'M4 20h4L19 9l-4-4L4 16v4ZM13 7l4 4',
  bibliotheque: 'M5 4h4v16H5zM11 4h4v16h-4zM17 5l3 .8-3.6 14.4-3-.8',
  dashboard: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z',
  prospects: 'M3 5h18l-7 8v6l-4 2v-8L3 5Z',
  clients: 'M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 9v-1a4 4 0 0 0-3-3.9M15 4.1a3 3 0 0 1 0 5.8',
  ventes: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M8 14h2M14 14h2M8 17h2',
  parametres: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2.2-1.3L14.4 3h-4l-.4 2.4a7.5 7.5 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a7.5 7.5 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3Z',
  sortie: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  outils: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  finances: 'M3 7h18v12H3zM3 11h18M7 15h3M16 4l-4 3-4-3',
  coffre: 'M4 5h16v14H4zM8 19v2M16 19v2M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 9v1M12 14v1',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z',
  cle: 'M14 10a4 4 0 1 0-3.5 4L9 16v2H7v2H4v-3l6.1-6.1M16.5 7.5h.01',
  eclair: 'M13 3L5 13h6l-1 8 8-10h-6l1-8Z',
  entree: 'M9 10l-4 4 4 4M5 14h11a3 3 0 0 0 3-3V5',
  accueil: 'M4 11l8-7 8 7v9h-5v-6H9v6H4v-9Z',
  resultats: 'M4 19V5M4 19h16M8 15l3.5-4 3 2.5L19 8',
  trafic: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12l6-6M15 6h3v3',
  releves: 'M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21V3ZM10 8h4M10 12h4',
  comptabilite: 'M5 3h14v18H5zM8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4v-3',
  lancement: 'M12 15l-3-3c1-4 4-8 10-9-1 6-5 9-9 10ZM9 12l-4 1 2-4M12 15l-1 4 4-2',
  ressources: 'M5 4h4v16H5zM11 4h4v16h-4zM17 5l3 .8-3.6 14.4-3-.8',
  recommander: 'M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 8v6M16 11h6',
  partage: 'M12 3v12M8 7l4-4 4 4M5 13v6h14v-6',
  telecharger: 'M12 4v11M8 11l4 4 4-4M5 19h14',
  etoile: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z',
  oeil: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17.5 6.5h.01',
  linkedin: 'M4 4h16v16H4zM8 10.5V16M8 7.5v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3',
  cible: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12h.01',
  feu: 'M12 21c-4 0-7-2.7-7-6.5 0-3 2-5 3.5-6.5.3 2 1.3 3 2.5 3.5C11 8 12 5 14.5 3c.5 3 4.5 5.5 4.5 11 0 4-3 7-7 7Z',
  reponse: 'M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 6 6v5',
  liste: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  colonnes: 'M4 4h4v16H4zM10 4h4v11h-4zM16 4h4v14h-4z',
  equipe: 'M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 9v-1a4 4 0 0 0-3-3.9M15 4.1a3 3 0 0 1 0 5.8',
  stats: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  audit: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-6-6M7 10h6M10 7v6',
  haut: 'M6 15l6-6 6 6',
  paiements: 'M3 7h18v11H3zM3 11h18M7 15h4M15 4l3 3-3 3M9 4 6 7l3 3',
}

export const Icone = ({ nom, className = 'h-4 w-4', epaisseur = 1.8 }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={TRACES[nom]} />
  </svg>
)

export function Bouton({ variante = 'principal', taille = 'md', icone, className = '', children, ...p }) {
  const styles = {
    principal: 'bg-vermillon text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_-8px_rgba(210,64,28,0.7)] hover:bg-[#bd3818]',
    encre: 'bg-encre text-papier shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_-10px_rgba(18,18,18,0.6)] hover:bg-black',
    secondaire: 'border border-craie bg-white text-encre shadow-[0_1px_2px_rgba(18,18,18,0.04)] hover:border-encre/30',
    discret: 'text-pierre hover:bg-craie/60 hover:text-encre',
    danger: 'text-pierre hover:bg-vermillon/10 hover:text-vermillon',
  }
  const tailles = { sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-4 text-sm' }
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      transition={RESSORT}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40 ${tailles[taille]} ${styles[variante]} ${className}`}
      {...p}
    >
      {icone && <Icone nom={icone} className="h-4 w-4" epaisseur={2} />}
      {children}
    </motion.button>
  )
}

// Titre de page : les mots montent un à un, l'accent en serif italique (promesse de la charte).
export function EnTete({ surtitre, titre: titreFr, accent: accentFr, sousTitre, children }) {
  // Titre traduit avant d'être découpé mot à mot.
  const titre = t(titreFr)
  const accent = t(accentFr)
  const mots = typeof titre === 'string' ? titre.split(' ') : null
  return (
    <div className="mb-9 flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
      <div className="min-w-0">
        {surtitre && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
            className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-pierre">
            <span className="h-1.5 w-1.5 rounded-full bg-vermillon" />
            {surtitre}
          </motion.div>
        )}
        <h1 translate="no" className="text-[36px] font-extrabold leading-[1] tracking-[-0.035em] md:text-[52px]">
          {mots ? mots.map((m, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className="inline-block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.06 }}>
                {m}{i < mots.length - 1 || accent ? ' ' : ''}
              </motion.span>
            </span>
          )) : titre}
          {accent && (
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className="inline-block font-serif font-normal italic tracking-[-0.02em] text-pierre" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.05 + (mots?.length || 1) * 0.06 }}>
                {accent}
              </motion.span>
            </span>
          )}
        </h1>
        {sousTitre && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-3 max-w-2xl font-serif text-[17px] italic text-pierre">
            {sousTitre}
          </motion.p>
        )}
      </div>
      {children && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }} className="flex flex-wrap items-center gap-2">
          {children}
        </motion.div>
      )}
    </div>
  )
}

export const Surtitre = ({ children, className = '' }) => (
  <div className={`text-[11px] font-semibold uppercase tracking-[0.12em] text-pierre ${className}`}>{children}</div>
)

// Apparition d'un bloc quand il entre à l'écran ; i décale chaque bloc d'une même rangée.
export function Apparition({ i = 0, className = '', children, as = 'div', ...p }) {
  const M = motion[as]
  return (
    <M
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 10) * 0.07 }}
      className={className}
      {...p}
    >
      {children}
    </M>
  )
}

// Chiffre qui défile jusqu'à sa valeur (et d'une valeur à l'autre quand la période change).
export function Compteur({ valeur, format = (v) => Math.round(v), duree = 1.1 }) {
  const ref = useRef(null)
  const actuel = useRef(0)
  useEffect(() => {
    const cible = Number(valeur) || 0
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      actuel.current = cible
      if (ref.current) ref.current.textContent = format(cible)
      return
    }
    const a = animate(actuel.current, cible, {
      duration: duree, ease: EASE,
      onUpdate: (v) => { actuel.current = v; if (ref.current) ref.current.textContent = format(v) },
    })
    return () => a.stop()
  }, [valeur]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{format(actuel.current)}</span>
}

export function Avatar({ nom, taille = 'md', sombre = false }) {
  const t = { sm: 'h-6 w-6 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm', xl: 'h-16 w-16 text-lg' }[taille]
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold tracking-tight ${t} ${sombre ? 'bg-encre text-papier' : 'bg-craie text-encre'}`}>
      {initiales(nom)}
    </span>
  )
}

export function Pastille({ children, ton = 'neutre', icone }) {
  const tons = {
    neutre: 'bg-craie/70 text-encre',
    plein: 'bg-encre text-papier',
    contour: 'border border-craie bg-white text-pierre',
    alerte: 'bg-vermillon/10 text-vermillon',
  }
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-semibold ${tons[ton]}`}>
      {icone && <Icone nom={icone} className="h-3 w-3" epaisseur={2.2} />}
      {children}
    </span>
  )
}

export function Champ({ label, children, className = '', aide }) {
  return (
    <label className={`block ${className}`}>
      <span className="etiquette">{label}</span>
      {children}
      {aide && <span className="mt-1 block text-xs text-pierre">{aide}</span>}
    </label>
  )
}

function useFermeture(onFermer) {
  useEffect(() => {
    const f = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', f)
    const o = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = o }
  }, [onFermer])
}

// À rendre dans <Presence> pour profiter de l'animation de fermeture.
// Les couches (fenêtres, tiroir) sont rendues à la racine : une page animée ne peut pas les enfermer.
const auPremierPlan = (contenu) => createPortal(contenu, document.body)

export function Fenetre({ titre, surtitre, onFermer, children, actions, large = false }) {
  useFermeture(onFermer)
  return auPremierPlan(
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-encre/35 backdrop-blur-[3px] md:items-center md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      onMouseDown={onFermer}
    >
      <motion.div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-papier shadow-[0_40px_100px_-30px_rgba(18,18,18,0.55)] md:rounded-[28px] ${large ? 'md:max-w-3xl' : 'md:max-w-xl'}`}
        initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={RESSORT}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6 md:px-7">
          <div className="min-w-0">
            {surtitre && <Surtitre className="mb-1">{surtitre}</Surtitre>}
            <h2 className="truncate text-[22px] font-extrabold tracking-tight">{titre}</h2>
          </div>
          <button onClick={onFermer} className="-mr-2 rounded-full p-2 text-pierre transition hover:rotate-90 hover:bg-craie/70 hover:text-encre" aria-label="Fermer">
            <Icone nom="fermer" className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-6 md:px-7">{children}</div>
        {actions && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-craie bg-white/60 px-6 py-4 md:px-7">{actions}</div>}
      </motion.div>
    </motion.div>,
  )
}

// Panneau latéral (fiches) : plein écran sur mobile. À rendre dans <Presence>.
export function Tiroir({ onFermer, children, entete, pied }) {
  useFermeture(onFermer)
  return auPremierPlan(
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-encre/35 backdrop-blur-[3px]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      onMouseDown={onFermer}
    >
      <motion.div
        className="flex h-full w-full max-w-[740px] flex-col bg-papier shadow-[0_0_120px_-20px_rgba(18,18,18,0.5)] md:rounded-l-[32px]"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 36 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0 border-b border-craie px-6 pb-5 pt-7 md:px-9">
          <button onClick={onFermer} className="absolute right-5 top-5 rounded-full p-2 text-pierre transition hover:rotate-90 hover:bg-craie/70 hover:text-encre" aria-label="Fermer">
            <Icone nom="fermer" className="h-5 w-5" />
          </button>
          {entete}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-7 md:px-9">{children}</div>
        {pied && <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-craie bg-white/60 px-6 py-4 md:px-9">{pied}</div>}
      </motion.div>
    </motion.div>,
  )
}

export function Vide({ titre, children, action }) {
  return (
    <Apparition className="relative flex flex-col items-center overflow-hidden rounded-[28px] border border-dashed border-craie bg-white/40 px-6 py-16 text-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} className="mb-5">
        <Symbole className="h-10 w-10 opacity-25" />
      </motion.div>
      {titre && <div className="text-lg font-extrabold tracking-tight">{titre}</div>}
      <p className="mt-1 max-w-sm font-serif text-[17px] italic text-pierre">{children}</p>
      {action && <div className="mt-6">{action}</div>}
    </Apparition>
  )
}

// Onglets : le fond de l'onglet actif glisse d'un choix à l'autre.
export function Onglets({ valeur, onChange, options, sombre = false }) {
  const id = useId()
  return (
    <div className={`relative inline-flex rounded-full p-1 ${sombre ? 'bg-white/10' : 'border border-craie bg-white shadow-[0_1px_2px_rgba(18,18,18,0.04)]'}`}>
      {options.map((o) => {
        const actif = valeur === o.id
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors sm:px-3.5 ${
              actif ? (sombre ? 'text-encre' : 'text-papier') : sombre ? 'text-papier/60 hover:text-papier' : 'text-pierre hover:text-encre'
            }`}
          >
            {actif && <motion.span layoutId={`onglet-${id}`} transition={RESSORT} className={`absolute inset-0 rounded-full ${sombre ? 'bg-papier' : 'bg-encre'}`} />}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function SelecteurMois({ mois, onChange, libelle }) {
  const sens = useRef(1)
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-craie bg-white shadow-[0_1px_2px_rgba(18,18,18,0.04)]">
      <button className="flex h-full items-center rounded-l-full px-3 text-pierre transition hover:text-encre" onClick={() => { sens.current = -1; onChange(-1) }} aria-label="Mois précédent"><Icone nom="gauche" /></button>
      <span className="relative min-w-[136px] overflow-hidden text-center text-sm font-semibold">
        <Presence mode="popLayout" initial={false} custom={sens.current}>
          <motion.span
            key={mois}
            custom={sens.current}
            className="block"
            initial={{ y: sens.current * 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -sens.current * 14, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {libelle(mois)}
          </motion.span>
        </Presence>
      </span>
      <button className="flex h-full items-center rounded-r-full px-3 text-pierre transition hover:text-encre" onClick={() => { sens.current = 1; onChange(1) }} aria-label="Mois suivant"><Icone nom="droite" /></button>
    </div>
  )
}

export function Progression({ faits, total, epais = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex-1 overflow-hidden rounded-full bg-craie ${epais ? 'h-2' : 'h-1.5'}`}>
        <motion.div
          className="h-full rounded-full bg-encre"
          initial={{ width: 0 }} animate={{ width: `${total ? (faits / total) * 100 : 0}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
      <span className="tabular text-xs font-semibold text-pierre">{faits}/{total}</span>
    </div>
  )
}

// Petite courbe sans axes pour les cartes ; elle se trace à l'apparition.
export function Sparkline({ valeurs, className = 'h-10 w-full', couleur = 'currentColor' }) {
  if (valeurs.length < 2) return null
  const max = Math.max(1, ...valeurs)
  const pts = valeurs.map((v, i) => [(i / (valeurs.length - 1)) * 100, 28 - (v / max) * 24])
  const d = traceLisse(pts)
  const cle = valeurs.join(',')
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={className} aria-hidden="true">
      <motion.path key={`a${cle}`} d={`${d} L100,30 L0,30 Z`} fill={couleur} initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ duration: 0.8, delay: 0.4 }} />
      <motion.path
        key={`l${cle}`}
        d={d} fill="none" stroke={couleur} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: EASE }}
      />
    </svg>
  )
}
