import { useMemo, useState } from 'react'
import { DOMAINE_LIENS } from '../config.js'
import { bornes, dans, parJour, soldes, totaux } from '../lib/calc.js'
import { PLAN, PLANS } from '../lib/reference.js'
import { dateCourte, dateLongue, entier, jourLong, moisLong, pct, usd } from '../lib/format.js'
import { Apparition, EnTete, Onglets, Surtitre } from '../loseless/ui.jsx'
import Graphique from '../loseless/Graphique.jsx'
import { Chiffre, Copier, Statut, Table, Td, Th, Vedette } from '../blocs.jsx'

const ONGLETS = [{ id: 'resume', label: 'Résumé' }, { id: 'ventes', label: 'Mes ventes' }, { id: 'paiements', label: 'Mes paiements' }, { id: 'contrat', label: 'Mon contrat' }]

/* L'espace de l'infopreneur : ses ventes, ses gains, ses paiements, son contrat. */
export default function Espace({ data, ventes, aujourdhui, p }) {
  const [onglet, setOnglet] = useState('resume')
  const b = bornes('mois', aujourdhui)
  const b30 = bornes('30j', aujourdhui)
  const mes = useMemo(() => ventes.filter((v) => v.partenaireId === p.id), [ventes, p.id])
  const clics = useMemo(() => data.clics.filter((c) => c.partenaireId === p.id), [data.clics, p.id])
  const jours = useMemo(() => parJour(mes.filter((v) => dans(v, b30)), clics.filter((c) => dans(c, b30)), b30), [mes, clics, b30.du])
  const mois = totaux(mes.filter((v) => dans(v, b)), clics.filter((c) => dans(c, b)))
  const t30 = totaux(mes.filter((v) => dans(v, b30)), clics.filter((c) => dans(c, b30)))
  const s = soldes(p.id, ventes, data.paiements)
  const actuel = p.contrats[p.contrats.length - 1]
  const lien = `${DOMAINE_LIENS}/${p.lien}`
  const points = jours.map((j) => ({ cle: j.date, libelle: dateLongue(j.date), libelleCourt: dateCourte(j.date), ...j }))

  return (
    <>
      <EnTete surtitre={jourLong(aujourdhui)} titre={`Bonjour ${p.nom.split(' ')[0]},`} accent="voici tes gains." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Vedette className="lg:col-span-7" label={`Gagné en ${moisLong(aujourdhui)}`} valeur={mois.part} aide="Ce que tes ventes du mois te rapportent."
          reperes={[[entier(mois.ventes), `vente${mois.ventes > 1 ? 's' : ''}`], [entier(mois.clics), 'clics sur ton lien'], [pct(mois.conversion), 'de conversion']]}
          courbe={jours.map((j) => j.part)} />
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
          <Chiffre i={1} className="sm:col-span-2" label="À recevoir" valeur={s.aPayer} alerte={s.aPayer > 0} aide="Tes ventes validées, pas encore payées" />
          <Chiffre i={2} label="En validation" valeur={s.attente} aide="Ventes récentes, pas encore validées" />
          <Chiffre i={3} label="Déjà reçu" valeur={s.paye} aide={`${entier(s.paiements.length)} paiement${s.paiements.length > 1 ? 's' : ''}`} />
        </div>
      </div>

      <div className="mb-4 mt-8"><Onglets valeur={onglet} onChange={setOnglet} options={ONGLETS} /></div>

      {onglet === 'resume' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Apparition className="carte p-6 md:p-7 lg:col-span-8">
            <Surtitre>30 derniers jours</Surtitre><div className="mb-4 mt-1 text-xl font-extrabold tracking-tight">Tes gains, jour par jour</div>
            <Graphique points={points} hauteur={240} titre="Tes gains" valeur={(x) => x.part} format={usd} details={[['Ventes', (x) => x.ventes], ['Clics', (x) => x.clics]]} />
          </Apparition>
          <Apparition i={1} className="carte p-6 md:p-7 lg:col-span-4">
            <Surtitre>Ton lien</Surtitre>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-craie bg-papier py-1 pl-4 pr-1"><code className="min-w-0 flex-1 truncate text-[13px] font-semibold">{lien}</code><Copier texte={'https://' + lien} /></div>
            <p className="mt-3 text-xs text-pierre">Chaque vente faite avec ce lien est pour toi.</p>
            <div className="mt-3 divide-y divide-craie/60 text-sm">
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
            <thead><tr><Th>Date</Th><Th>Abonnement vendu</Th><Th>État</Th><Th n>Pour toi</Th></tr></thead>
            <tbody>
              {mes.map((v) => (
                <tr key={v.id} className={v.statut === 'annulee' ? 'text-pierre/60 [&_td.tabular]:line-through' : ''}>
                  <Td>{dateCourte(v.date)}</Td><Td>{PLAN[v.plan].label}</Td><Td><Statut s={v.statut} /></Td><Td n>{usd(v.part)}</Td>
                </tr>
              ))}
              {!mes.length && <tr><Td colSpan={4} className="py-10 text-center text-pierre">Ta première vente apparaîtra ici.</Td></tr>}
            </tbody>
          </Table>
        </Apparition>
      )}

      {onglet === 'paiements' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Apparition className="carte overflow-hidden lg:col-span-7">
            <Table>
              <thead><tr><Th>Paiement reçu le</Th><Th n>Montant</Th></tr></thead>
              <tbody>
                {s.paiements.map((x) => <tr key={x.id}><Td>{dateLongue(x.date)}</Td><Td n>{usd(x.montant)}</Td></tr>)}
                {!s.paiements.length && <tr><Td colSpan={2} className="py-10 text-center text-pierre">Ton premier paiement arrivera après la validation de tes premières ventes.</Td></tr>}
              </tbody>
            </Table>
          </Apparition>
          <Apparition i={1} className="carte p-6 md:p-7 lg:col-span-5">
            <Surtitre>Ton solde</Surtitre>
            <div className="mt-3 divide-y divide-craie/60 text-sm">
              <div className="flex justify-between py-3"><span className="text-pierre">Gagné (ventes validées)</span><span className="tabular font-semibold">{usd(s.du)}</span></div>
              <div className="flex justify-between py-3"><span className="text-pierre">Déjà reçu</span><span className="tabular font-semibold">− {usd(s.paye)}</span></div>
              <div className="flex justify-between py-3 font-extrabold"><span>À recevoir</span><span className={`tabular ${s.aPayer ? 'text-vermillon' : ''}`}>{usd(s.aPayer)}</span></div>
            </div>
            <p className="mt-3 text-xs text-pierre">Une vente est validée environ 30 jours après l’achat. Une vente remboursée est annulée et n’est pas payée.</p>
          </Apparition>
        </div>
      )}

      {onglet === 'contrat' && (
        <Apparition className="carte overflow-hidden">
          <div className="px-6 pb-3 pt-6 md:px-7"><Surtitre>Ton contrat</Surtitre><div className="mt-1 text-sm text-pierre">Depuis le {dateLongue(actuel.depuis)}</div></div>
          <Table>
            <thead><tr><Th>Abonnement vendu</Th><Th n>Tu touches</Th></tr></thead>
            <tbody>{PLANS.map((pl) => <tr key={pl.code}><Td className="font-semibold">{pl.label}</Td><Td n className="text-base font-extrabold">{usd(actuel.grille[pl.code])}</Td></tr>)}</tbody>
          </Table>
        </Apparition>
      )}
    </>
  )
}
