import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { DEMO, MARQUE } from './config.js'
import { creerDemo } from './lib/demo.js'
import { enrichir, soldes } from './lib/calc.js'
import { isoDuJour } from './lib/format.js'
import { Avatar, Bouton, EASE, Presence, RESSORT } from './loseless/ui.jsx'
import { Dock, NouvelInfopreneur } from './blocs.jsx'
import Vue from './pages/Vue.jsx'
import Infopreneurs from './pages/Infopreneurs.jsx'
import Fiche from './pages/Fiche.jsx'
import Compta from './pages/Compta.jsx'
import Contrats from './pages/Contrats.jsx'
import Espace from './pages/Espace.jsx'

/* L'adresse dit où l'on est : #/vue, #/infopreneurs, #/infopreneur/<id>,
   #/compta, #/contrats, #/espace/<id> (ce que voit l'infopreneur). */
const lireRoute = () => {
  const [page = 'vue', id = null] = location.hash.replace(/^#\/?/, '').split('/')
  return { page: page || 'vue', id }
}

export default function App() {
  const aujourdhui = isoDuJour()
  const [data, setData] = useState(() => creerDemo(aujourdhui))
  const [route, setRoute] = useState(lireRoute)
  const [nouveau, setNouveau] = useState(false)
  const [defile, setDefile] = useState(false)

  useEffect(() => {
    const f = () => { setRoute(lireRoute()); window.scrollTo(0, 0) }
    const d = () => setDefile(window.scrollY > 8)
    window.addEventListener('hashchange', f)
    window.addEventListener('scroll', d, { passive: true })
    return () => { window.removeEventListener('hashchange', f); window.removeEventListener('scroll', d) }
  }, [])
  const aller = useCallback((h) => { location.hash = '/' + h }, [])
  const ventes = useMemo(() => enrichir(data), [data])

  /* Les actions de l'interface. En démo elles modifient les données en
     mémoire ; branchées, elles écriront dans la base. */
  const act = useMemo(() => ({
    contrat: (pid, contrat) => setData((d) => ({
      ...d,
      partenaires: d.partenaires.map((p) => p.id !== pid ? p : {
        ...p, contrats: [...p.contrats.filter((c) => c.depuis < contrat.depuis), contrat].sort((a, b) => (a.depuis < b.depuis ? -1 : 1)),
      }),
    })),
    payer: (pid, montant) => setData((d) => ({
      ...d, paiements: [...d.paiements, { id: 'p' + Date.now(), partenaireId: pid, date: isoDuJour(), montant }],
    })),
    ajouter: (p) => setData((d) => ({
      ...d,
      partenaires: [...d.partenaires, {
        id: p.lien, nom: p.nom, langue: p.langue, niche: p.niche, lien: p.lien, depuis: isoDuJour(),
        contrats: [{ depuis: isoDuJour(), grille: { ...p.grille } }],
      }],
    })),
  }), [])

  const ctx = { data, ventes, aujourdhui, aller, act }
  const espace = route.page === 'espace' ? data.partenaires.find((p) => p.id === route.id) || data.partenaires[0] : null
  const courant = route.page === 'infopreneur' ? 'infopreneurs' : route.page
  const aPayer = data.partenaires.filter((p) => soldes(p.id, ventes, data.paiements).aPayer > 0).length
  const modules = espace
    ? [{ id: 'espace/' + espace.id, label: 'Mon espace', icone: 'accueil' }]
    : [
      { id: 'vue', label: 'Vue d’ensemble', icone: 'dashboard' },
      { id: 'infopreneurs', label: 'Infopreneurs', icone: 'clients' },
      { id: 'compta', label: 'Comptabilité', icone: 'comptabilite', alerte: aPayer },
      { id: 'contrats', label: 'Contrats', icone: 'doc' },
    ]
  const dockCourant = espace ? 'espace/' + espace.id : courant

  let page
  if (espace) page = <Espace {...ctx} p={espace} />
  else if (route.page === 'infopreneur') page = <Fiche {...ctx} id={route.id} />
  else if (route.page === 'infopreneurs') page = <Infopreneurs {...ctx} ouvrirNouveau={() => setNouveau(true)} />
  else if (route.page === 'compta') page = <Compta {...ctx} />
  else if (route.page === 'contrats') page = <Contrats {...ctx} />
  else page = <Vue {...ctx} />

  return (
    <div className="min-h-screen">
      <div className="grain" aria-hidden="true" />

      <header className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${defile ? 'bg-papier/80 shadow-[0_1px_0_rgba(230,226,218,0.9)] backdrop-blur-xl' : ''}`}>
        <div className={`relative mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 transition-[padding] duration-300 md:px-8 ${defile ? 'py-2.5' : 'py-4 md:py-5'}`}>
          <button type="button" onClick={() => aller(espace ? 'espace/' + espace.id : 'vue')} className="flex items-baseline gap-[3px] text-[21px] font-extrabold tracking-tight">
            {MARQUE.toLowerCase()}<span className="h-[7px] w-[7px] rounded-full bg-vermillon" />
          </button>
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block"><Dock modules={modules} courant={dockCourant} aller={aller} /></div>
          <div className="flex items-center gap-2">
            {!espace && <Bouton icone="plus" onClick={() => setNouveau(true)}><span className="hidden sm:inline">Nouvel infopreneur</span></Bouton>}
            <span className="flex items-center gap-2 rounded-full border border-craie bg-white py-1 pl-1 pr-3 shadow-[0_1px_2px_rgba(18,18,18,0.04)]">
              <Avatar nom={espace ? espace.nom : 'Anthony'} taille="md" sombre />
              <span className="hidden text-sm font-semibold lg:block">{espace ? espace.nom : 'Anthony'}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="px-4 pb-36 pt-6 md:px-8 md:pb-20 md:pt-10">
        <div className="mx-auto max-w-[1240px]">
          {DEMO && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed border-craie bg-white/40 px-4 py-2.5 text-[13px]">
              <span className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-vermillon sm:block" />
              <span className="text-pierre">{espace ? 'Aperçu : voici ce que verra l’infopreneur une fois connecté. Données de démonstration.' : 'Données de démonstration : noms et chiffres fictifs, rien n’est encore branché.'}</span>
              {espace && <button type="button" onClick={() => aller('infopreneur/' + espace.id)} className="ml-auto font-semibold underline-offset-4 hover:underline">← Revenir à l’admin</button>}
            </motion.div>
          )}
          <Presence mode="wait" initial={false}>
            <motion.div key={route.page + (route.id || '')}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }} exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: EASE }}>
              {page}
            </motion.div>
          </Presence>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(14px,env(safe-area-inset-bottom))] md:hidden">
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...RESSORT, delay: 0.2 }}><Dock modules={modules} courant={dockCourant} aller={aller} mobile /></motion.div>
      </div>

      <Presence>{nouveau && <NouvelInfopreneur data={data} act={act} aller={aller} onFermer={() => setNouveau(false)} />}</Presence>
    </div>
  )
}
