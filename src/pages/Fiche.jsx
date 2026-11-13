import { useMemo, useState } from 'react'
import { DOMAINE_LIENS } from '../config.js'
import { bornes, dans, parJour, soldes, totaux } from '../lib/calc.js'
import { PLAN, PLANS } from '../lib/reference.js'
import { dateCourte, dateLongue, entier, moisLong, pct, usd } from '../lib/format.js'
import { Apparition, Bouton, EnTete, Onglets, Presence, Surtitre } from '../loseless/ui.jsx'
import Graphique from '../loseless/Graphique.jsx'
import { Chiffre, Contrat, Copier, ModifierContrat, Statut, Table, Td, Th, Vedette } from '../blocs.jsx'

const ONGLETS = [{ id: 'resume', label: 'Résumé' }, { id: 'ventes', label: 'Ventes' }, { id: 'paiements', label: 'Paiements' }, { id: 'contrat', label: 'Contrat' }]

/* L'espace d'un infopreneur, vu de l'admin. */
export default function Fiche({ data, ventes, aujourdhui, id, aller, act }) {
  const p = data.partenaires.find((x) => x.id === id)
  const [onglet, setOnglet] = useState('resume')
  const [modifier, setModifier] = useState(false)
  const b = bornes('mois', aujourdhui)
  const b30 = bornes('30j', aujourdhui)
  const mes = useMemo(() => ventes.filter((v) => v.partenaireId === id), [ventes, id])
  const clics = useMemo(() => data.clics.filter((c) => c.partenaireId === id), [data.clics, id])
  const jours = useMemo(() => parJour(mes.filter((v) => dans(v, b30)), clics.filter((c) => dans(c, b30)), b30), [mes, clics, b30.du])
  if (!p) return <EnTete titre="Infopreneur introuvable"><Bouton variante="secondaire" onClick={() => aller('infopreneurs')}>Retour</Bouton></EnTete>

  const mois = totaux(mes.filter((v) => dans(v, b)))
  const t30 = totaux(mes.filter((v) => dans(v, b30)), clics.filter((c) => dans(c, b30)))
  const s = soldes(id, ventes, data.paiements)
  const actuel = p.contrats[p.contrats.length - 1]
  const lien = `${DOMAINE_LIENS}/${p.lien}`
  const points = jours.map((j) => ({ cle: j.date, libelle: dateLongue(j.date), libelleCourt: dateCourte(j.date), ...j }))

  return (
    <>
      <button type="button" onClick={() => aller('infopreneurs')} className="mb-5 text-sm font-semibold text-pierre transition hover:text-encre">← Infopreneurs</button>
      <EnTete surtitre={[p.langue, p.niche, 'depuis le ' + dateLongue(p.depuis)].filter(Boolean).join(' · ')} titre={p.nom}>
        <Bouton variante="secondaire" icone="oeil" onClick={() => aller('espace/' + p.id)}>Voir son espace</Bouton>
      </EnTete>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Vedette className="lg:col-span-7" label={`Notre marge · ${moisLong(aujourdhui)}`} valeur={mois.marge} aide="Ce qu’il nous reste sur ses ventes du mois, une fois sa part retirée."
          reperes={[[usd(mois.base44), 'versés par Base44'], [entier(mois.ventes), `vente${mois.ventes > 1 ? 's' : ''}`], [pct(mois.tauxMarge), 'de marge']]}
          courbe={jours.map((j) => j.marge)} />
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
          <Chiffre i={1} className="sm:col-span-2" label={`Il a gagné en ${moisLong(aujourdhui)}`} valeur={mois.part} aide={`${entier(mois.ventes)} vente${mois.ventes > 1 ? 's' : ''} ce mois-ci, selon son contrat`} />
          <Chiffre i={2} label="On lui doit" valeur={s.aPayer} alerte={s.aPayer > 0} aide="Ventes validées, pas encore payées">
            {s.aPayer > 0 && <Bouton taille="sm" className="mt-4" onClick={() => act.payer(p.id, s.aPayer)}>Marquer payé</Bouton>}
          </Chiffre>
          <Chiffre i={3} label="Déjà payé" valeur={s.paye} aide={`${entier(s.paiements.length)} paiement${s.paiements.length > 1 ? 's' : ''}`} />
        </div>
      </div>

      <div className="mb-4 mt-8"><Onglets valeur={onglet} onChange={setOnglet} options={ONGLETS} /></div>

      {onglet === 'resume' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Apparition className="carte p-6 md:p-7 lg:col-span-8">
            <Surtitre>Ses 30 derniers jours</Surtitre><div className="mb-4 mt-1 text-xl font-extrabold tracking-tight">Ce qu’il a gagné, jour par jour</div>
            <Graphique points={points} hauteur={240} titre="Ce qu’il a gagné" valeur={(x) => x.part} format={usd} details={[['Notre marge', (x) => usd(x.marge)], ['Ventes', (x) => x.ventes]]} />
          </Apparition>
          <Apparition i={1} className="carte p-6 md:p-7 lg:col-span-4">
            <Surtitre>Son lien</Surtitre>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-craie bg-papier py-1 pl-4 pr-1"><code className="min-w-0 flex-1 truncate text-[13px] font-semibold">{lien}</code><Copier texte={'https://' + lien} /></div>
            <div className="mt-5 divide-y divide-craie/60 text-sm">
              {[['Clics sur 30 jours', entier(t30.clics)], ['Ventes sur 30 jours', entier(t30.ventes)], ['Conversion', pct(t30.conversion)]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between py-3"><span className="text-pierre">{l}</span><span className="tabular font-extrabold">{v}</span></div>
              ))}
            </div>
          </Apparition>
        </div>
      )}

      {onglet === 'ventes' && (
        <Apparition className="carte overflow-hidden">
          <Table>
            <thead><tr><Th>Date</Th><Th>Abonnement</Th><Th>État</Th><Th n>Base44 nous verse</Th><Th n>Sa part</Th><Th n>Notre marge</Th></tr></thead>
            <tbody>
              {mes.map((v) => (
                <tr key={v.id} className={v.statut === 'annulee' ? 'text-pierre/60 [&_td.tabular]:line-through' : ''}>
                  <Td>{dateCourte(v.date)}</Td><Td>{PLAN[v.plan].label}</Td><Td><Statut s={v.statut} /></Td>
                  <Td n className="!font-normal text-pierre">{usd(v.base44Net)}</Td><Td n>{usd(v.part)}</Td><Td n>{usd(v.marge)}</Td>
                </tr>
              ))}
              {!mes.length && <tr><Td colSpan={6} className="py-10 text-center text-pierre">Pas encore de vente.</Td></tr>}
            </tbody>
          </Table>
        </Apparition>
      )}

      {onglet === 'paiements' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Apparition className="carte overflow-hidden lg:col-span-7">
            <Table>
              <thead><tr><Th>Paiement fait le</Th><Th n>Montant</Th></tr></thead>
              <tbody>
                {s.paiements.map((x) => <tr key={x.id}><Td>{dateLongue(x.date)}</Td><Td n>{usd(x.montant)}</Td></tr>)}
                {!s.paiements.length && <tr><Td colSpan={2} className="py-10 text-center text-pierre">Aucun paiement pour l’instant.</Td></tr>}
              </tbody>
            </Table>
          </Apparition>
          <Apparition i={1} className="carte p-6 md:p-7 lg:col-span-5">
            <Surtitre>Son solde</Surtitre>
            <div className="mt-3 divide-y divide-craie/60 text-sm">
              <div className="flex justify-between py-3"><span className="text-pierre">Gagné (ventes validées)</span><span className="tabular font-semibold">{usd(s.du)}</span></div>
              <div className="flex justify-between py-3"><span className="text-pierre">Déjà payé</span><span className="tabular font-semibold">− {usd(s.paye)}</span></div>
              <div className="flex justify-between py-3 font-extrabold"><span>On lui doit</span><span className={`tabular ${s.aPayer ? 'text-vermillon' : ''}`}>{usd(s.aPayer)}</span></div>
              <div className="flex justify-between py-3"><span className="text-pierre">Ventes pas encore validées</span><span className="tabular text-pierre">{usd(s.attente)}</span></div>
            </div>
            {s.aPayer > 0 && <Bouton className="mt-4 w-full" onClick={() => act.payer(p.id, s.aPayer)}>Marquer {usd(s.aPayer)} comme payés</Bouton>}
          </Apparition>
        </div>
      )}

      {onglet === 'contrat' && (
        <Apparition className="carte overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-3 pt-6 md:px-7">
            <div><Surtitre>Contrat actuel</Surtitre><div className="mt-1 text-sm text-pierre">Depuis le {dateLongue(actuel.depuis)}</div></div>
            <Bouton variante="secondaire" icone="modifier" onClick={() => setModifier(true)}>Modifier le contrat</Bouton>
          </div>
          <Contrat grille={actuel.grille} />
          {p.contrats.length > 1 && (
            <div className="border-t border-craie/60 bg-papier/50 px-6 py-4 text-[13px] text-pierre md:px-7">
              <span className="font-semibold text-encre">Anciens contrats : </span>
              {[...p.contrats].slice(0, -1).reverse().map((c) => `du ${dateCourte(c.depuis)} : ${PLANS.map((pl) => usd(c.grille[pl.code])).join(' / ')}`).join(' · ')}. Chaque vente garde le tarif du jour où elle a été faite.
            </div>
          )}
        </Apparition>
      )}

      <Presence>{modifier && <ModifierContrat p={p} act={act} onFermer={() => setModifier(false)} />}</Presence>
    </>
  )
}
