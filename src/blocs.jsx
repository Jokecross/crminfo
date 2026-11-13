/* Les blocs du dash, montés avec les composants de l'outil Loseless. */
import { useState } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { Apparition, Bouton, Champ, Compteur, EASE, Fenetre, Icone, Pastille, Presence, RESSORT, Sparkline, Surtitre } from './loseless/ui.jsx'
import { DOMAINE_LIENS } from './config.js'
import { isoDuJour, usd } from './lib/format.js'
import { NIVEAUX_DEPART, PLANS, STATUTS } from './lib/reference.js'
import { PERIODES } from './lib/calc.js'

export const PERIODES_ONGLETS = PERIODES.map((p) => ({ id: p.code, label: p.label }))

/* Le dock : la pilule Encre de Loseless. Seul l'onglet actif montre son nom. */
export function Dock({ modules, courant, aller, mobile = false }) {
  return (
    <LayoutGroup id={mobile ? 'dock-mobile' : 'dock'}>
      <nav className={`flex items-center rounded-full bg-encre p-1.5 text-papier shadow-[0_18px_40px_-18px_rgba(18,18,18,0.75),inset_0_1px_0_rgba(255,255,255,0.06)] ${mobile ? 'gap-0.5' : 'gap-1'}`} aria-label="Navigation">
        {modules.map((m) => {
          const actif = courant === m.id
          return (
            <motion.button key={m.id} layout type="button" onClick={() => aller(m.id)} transition={RESSORT} aria-current={actif ? 'page' : undefined}
              className={`group relative flex items-center rounded-full ${mobile ? 'h-11 px-2.5' : 'h-10 px-3'} ${actif ? 'text-encre' : 'text-papier/55 hover:text-papier'}`}>
              {actif && <motion.span layoutId="dock-actif" transition={RESSORT} className="absolute inset-0 rounded-full bg-papier" />}
              <motion.span layout="position" className="relative flex items-center">
                <Icone nom={m.icone} className="h-[18px] w-[18px]" epaisseur={actif ? 2.1 : 1.8} />
                <Presence initial={false}>
                  {actif && (
                    <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden whitespace-nowrap text-[13px] font-bold">
                      <span className="pl-2 pr-0.5">{m.label}</span>
                    </motion.span>
                  )}
                </Presence>
                {m.alerte > 0 && !actif && <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-vermillon" />}
              </motion.span>
              {!actif && !mobile && (
                <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-lg bg-encre px-2.5 py-1 text-[11px] font-semibold text-papier opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">{m.label}</span>
              )}
            </motion.button>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}

/* La grande carte Encre : le chiffre vedette, ses trois repères, sa courbe. */
export function Vedette({ label, valeur, aide, reperes = [], courbe, className = '' }) {
  return (
    <Apparition i={0} className={`relative overflow-hidden rounded-[32px] bg-encre p-7 text-papier shadow-[0_40px_80px_-40px_rgba(18,18,18,0.7)] md:p-10 ${className}`}>
      <motion.div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 h-80 w-80" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#F4F2EE" strokeOpacity="0.06" strokeWidth="16" />
          <circle cx="76.9" cy="23.1" r="5" fill="#D2401C" />
        </svg>
      </motion.div>
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vermillon opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-vermillon" /></span>
          <Surtitre className="!text-papier/55">{label}</Surtitre>
        </div>
        <div className="tabular mt-5 text-[52px] font-extrabold leading-[0.9] tracking-[-0.045em] md:text-[84px]"><Compteur valeur={valeur} format={usd} /></div>
        {aide && <div className="mt-5 text-xs text-papier/50 md:text-sm">{aide}</div>}
        {reperes.length > 0 && (
          <div className="mt-8 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
            {reperes.map(([v, l], i) => (
              <div key={l} className={i ? 'pl-4 md:pl-6' : 'pr-4'}>
                <div className="tabular text-xl font-extrabold tracking-tight md:text-2xl">{v}</div>
                <div className="mt-0.5 text-xs text-papier/50 md:text-sm">{l}</div>
              </div>
            ))}
          </div>
        )}
        {courbe && <Sparkline valeurs={courbe} className="mt-7 h-14 w-full text-papier/70" />}
      </div>
    </Apparition>
  )
}

/* Une carte blanche avec un chiffre. `alerte` = en Vermillon (ce qu'il reste à payer). */
export function Chiffre({ i = 1, label, valeur, aide, alerte, etiquette, children, className = '' }) {
  return (
    <Apparition i={i} className={`carte relative overflow-hidden p-6 md:p-7 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Surtitre>{label}</Surtitre>
          <div className={`tabular mt-3 text-[36px] font-extrabold leading-none tracking-[-0.035em] md:text-[42px] ${alerte ? 'text-vermillon' : ''}`}><Compteur valeur={valeur} format={usd} /></div>
        </div>
        {etiquette && <span className="rounded-full bg-craie/70 px-2.5 py-1 text-xs font-bold">{etiquette}</span>}
      </div>
      {aide && <div className="mt-3 text-xs text-pierre">{aide}</div>}
      {children}
    </Apparition>
  )
}

/* Une ligne « libellé — barre — montant », comme sur le tableau de bord Loseless. */
export function LigneBarre({ label, valeur, max, sombre, i = 0 }) {
  return (
    <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3 text-xs">
      <span className="text-pierre">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-papier">
        <motion.span className={`block h-full rounded-full ${sombre ? 'bg-encre' : 'bg-craie'}`} initial={{ width: 0 }} animate={{ width: `${(valeur / Math.max(1, max)) * 100}%` }} transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.1 }} />
      </span>
      <span className="tabular w-20 text-right font-semibold">{usd(valeur)}</span>
    </div>
  )
}

const TONS = { attente: 'contour', validee: 'plein', annulee: 'alerte' }
export const Statut = ({ s }) => <Pastille ton={TONS[s]}>{STATUTS[s].label}</Pastille>

/* Tableau : en-têtes en petites capitales, lignes séparées par un filet Craie. */
export const Table = ({ children }) => <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm">{children}</table></div>
export const Th = ({ children, n }) => <th className={`whitespace-nowrap border-b border-craie px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-pierre ${n ? 'text-right' : 'text-left'}`}>{children}</th>
export const Td = ({ children, n, className = '', ...p }) => <td className={`whitespace-nowrap border-b border-craie/60 px-6 py-4 ${n ? 'tabular text-right font-semibold' : ''} ${className}`} {...p}>{children}</td>

export function Copier({ texte }) {
  const [ok, setOk] = useState(false)
  return <Bouton variante="encre" taille="sm" icone={ok ? 'coche' : 'copier'} onClick={() => { navigator.clipboard?.writeText(texte); setOk(true); setTimeout(() => setOk(false), 1600) }}>{ok ? 'Copié' : 'Copier'}</Bouton>
}

/* Le contrat : ce que Base44 verse, ce qu'il touche, ce qui nous reste. */
export function Contrat({ grille, changer }) {
  return (
    <Table>
      <thead><tr><Th>Abonnement vendu</Th><Th n>Base44 nous verse</Th><Th n>Il touche</Th><Th n>Notre marge</Th></tr></thead>
      <tbody>
        {PLANS.map((pl) => (
          <tr key={pl.code}>
            <Td className="font-semibold">{pl.label}</Td>
            <Td n className="!font-normal text-pierre">{usd(pl.base44)}</Td>
            <Td n>{changer
              ? <input type="number" min="0" step="5" className="champ !h-9 !w-24 text-right font-semibold" value={grille[pl.code]} aria-label={'Il touche ' + pl.label} onChange={(e) => changer({ ...grille, [pl.code]: Math.max(0, +e.target.value || 0) })} />
              : usd(grille[pl.code])}</Td>
            <Td n className={pl.base44 - grille[pl.code] < 0 ? 'text-vermillon' : ''}>{usd(pl.base44 - grille[pl.code])}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export function ModifierContrat({ p, act, onFermer }) {
  const actuel = p.contrats[p.contrats.length - 1]
  const [grille, setGrille] = useState({ ...actuel.grille })
  const [depuis, setDepuis] = useState(isoDuJour())
  const negatif = PLANS.some((pl) => grille[pl.code] > pl.base44)
  return (
    <Fenetre surtitre="Contrat" titre={p.nom} onFermer={onFermer} large
      actions={<><Bouton variante="secondaire" onClick={onFermer}>Annuler</Bouton><Bouton onClick={() => { act.contrat(p.id, { depuis, grille }); onFermer() }}>Enregistrer</Bouton></>}>
      <p className="mb-5 text-sm text-pierre">Change ce qu’il touche par vente. Ses ventes déjà faites gardent l’ancien tarif.</p>
      <Champ label="Nouveau contrat à partir du" className="mb-5 max-w-[220px]"><input type="date" className="champ" value={depuis} onChange={(e) => e.target.value && setDepuis(e.target.value)} /></Champ>
      <div className="carte"><Contrat grille={grille} changer={setGrille} /></div>
      {negatif && <div className="mt-4 rounded-2xl bg-vermillon/10 px-4 py-3 text-sm font-semibold text-vermillon">Attention : sur au moins un abonnement, il toucherait plus que ce que Base44 nous verse.</div>}
    </Fenetre>
  )
}

const versLien = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9 -]/g, '').trim().replace(/[ -]+/g, '-').slice(0, 30)

export function NouvelInfopreneur({ data, act, aller, onFermer }) {
  const [f, setF] = useState({ nom: '', langue: '', niche: '', lien: '' })
  const [grille, setGrille] = useState({ ...NIVEAUX_DEPART[0].grille })
  const [touche, setTouche] = useState(false)
  const lien = touche ? f.lien : versLien(f.nom)
  const pris = data.partenaires.some((p) => p.id === lien)
  const ok = f.nom.trim() && lien && !pris
  const valider = () => { if (!ok) return; act.ajouter({ ...f, nom: f.nom.trim(), lien, grille }); onFermer(); aller('infopreneur/' + lien) }
  return (
    <Fenetre surtitre="Nouveau" titre="Nouvel infopreneur" onFermer={onFermer} large
      actions={<><Bouton variante="secondaire" onClick={onFermer}>Annuler</Bouton><Bouton disabled={!ok} onClick={valider}>Créer</Bouton></>}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Champ label="Nom" className="md:col-span-2"><input autoFocus className="champ" value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} placeholder="Prénom N." /></Champ>
        <Champ label="Langue"><input className="champ" value={f.langue} onChange={(e) => setF({ ...f, langue: e.target.value })} placeholder="FR, AR, EN…" /></Champ>
        <Champ label="Business"><input className="champ" value={f.niche} onChange={(e) => setF({ ...f, niche: e.target.value })} placeholder="E-commerce, coaching…" /></Champ>
        <Champ label="Son lien" className="md:col-span-2" aide={pris ? 'Ce lien est déjà pris.' : null}>
          <span className="flex items-center gap-2"><span className="whitespace-nowrap text-sm text-pierre">{DOMAINE_LIENS}/</span><input className="champ" value={lien} onChange={(e) => { setTouche(true); setF({ ...f, lien: versLien(e.target.value) }) }} placeholder="karim" /></span>
        </Champ>
      </div>
      <Surtitre className="mb-2 mt-6">Son contrat</Surtitre>
      <div className="carte"><Contrat grille={grille} changer={setGrille} /></div>
    </Fenetre>
  )
}
