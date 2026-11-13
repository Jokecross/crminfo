import { useMemo, useState } from 'react'
import { bornes, dans, parJour, soldes, totaux } from '../lib/calc.js'
import { dateCourte, dateLongue, entier, jourLong, pct, usd } from '../lib/format.js'
import { Apparition, Avatar, Bouton, EnTete, Icone, Onglets, Surtitre } from '../loseless/ui.jsx'
import Graphique from '../loseless/Graphique.jsx'
import { Chiffre, LigneBarre, PERIODES_ONGLETS, Table, Td, Th, Vedette } from '../blocs.jsx'

export default function Vue({ data, ventes, aujourdhui, aller }) {
  const [periode, setPeriode] = useState('mois')
  const b = bornes(periode, aujourdhui)
  const vp = useMemo(() => ventes.filter((v) => dans(v, b)), [ventes, b.du, b.au])
  const cp = useMemo(() => data.clics.filter((c) => dans(c, b)), [data.clics, b.du, b.au])
  const t = totaux(vp, cp)
  const jours = useMemo(() => parJour(vp, cp, b), [vp, cp])
  const points = jours.map((j) => ({ cle: j.date, libelle: dateLongue(j.date), libelleCourt: dateCourte(j.date), ...j }))
  const lignes = data.partenaires
    .map((p) => ({ p, t: totaux(vp.filter((v) => v.partenaireId === p.id)), s: soldes(p.id, ventes, data.paiements) }))
    .sort((a, z) => z.t.marge - a.t.marge)
  const aPayer = lignes.reduce((s, l) => s + l.s.aPayer, 0)
  const nbAPayer = lignes.filter((l) => l.s.aPayer > 0).length
  const heure = new Date().getHours()

  return (
    <>
      <EnTete surtitre={jourLong(aujourdhui)} titre={`${heure < 5 || heure >= 18 ? 'Bonsoir' : 'Bonjour'} Anthony,`} accent="voici le réseau.">
        <Onglets valeur={periode} onChange={setPeriode} options={PERIODES_ONGLETS} />
      </EnTete>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Vedette className="lg:col-span-7" label="Notre marge" valeur={t.marge} aide="Ce qu’il nous reste une fois les infopreneurs payés."
          reperes={[[usd(t.base44), 'versés par Base44'], [entier(t.ventes), `vente${t.ventes > 1 ? 's' : ''}`], [pct(t.tauxMarge), 'de marge']]}
          courbe={jours.map((j) => j.marge)} />
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:col-span-5">
          <Chiffre i={1} label="Part des infopreneurs" valeur={t.part} etiquette="selon leurs contrats">
            <div className="mt-6 space-y-2.5">
              <LigneBarre label="Infopreneurs" valeur={t.part} max={t.base44} />
              <LigneBarre label="Notre marge" valeur={t.marge} max={t.base44} sombre i={1} />
            </div>
          </Chiffre>
          <Apparition i={2} as="button" onClick={() => aller('compta')} className="carte-lien group flex items-center justify-between gap-4 p-6 text-left md:p-7">
            <div>
              <Surtitre>Reste à leur payer</Surtitre>
              <div className="tabular mt-3 text-[36px] font-extrabold leading-none tracking-[-0.035em] text-vermillon md:text-[42px]">{usd(aPayer)}</div>
              <div className="mt-3 text-xs text-pierre">{nbAPayer ? `Ventes validées, pas encore payées · ${entier(nbAPayer)} infopreneur${nbAPayer > 1 ? 's' : ''}` : 'Tout le monde est payé'}</div>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-papier text-pierre transition group-hover:bg-encre group-hover:text-papier"><Icone nom="droite" /></span>
          </Apparition>
        </div>
      </div>

      <Apparition i={3} className="carte mt-4 p-6 md:p-7">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><Surtitre>Jour par jour</Surtitre><div className="mt-1 text-xl font-extrabold tracking-tight">Évolution de notre marge</div></div>
          <div className="text-xs text-pierre">Survole la courbe pour voir le détail d’un jour</div>
        </div>
        <Graphique points={points} hauteur={260} titre="Évolution de notre marge" valeur={(p) => p.marge} format={usd}
          details={[['Part des infopreneurs', (p) => usd(p.part)], ['Ventes', (p) => p.ventes]]} />
      </Apparition>

      <Apparition i={4} className="carte mt-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 pb-2 pt-6 md:px-7">
          <div><Surtitre>Le réseau</Surtitre><div className="mt-1 text-xl font-extrabold tracking-tight">Les infopreneurs</div></div>
          <Bouton variante="secondaire" taille="sm" onClick={() => aller('infopreneurs')}>Tout voir</Bouton>
        </div>
        <Table>
          <thead><tr><Th>Infopreneur</Th><Th n>Ventes</Th><Th n>Sa part</Th><Th n>Notre marge</Th><Th n>Reste à lui payer</Th></tr></thead>
          <tbody>
            {lignes.map(({ p, t: x, s }, i) => (
              <tr key={p.id} onClick={() => aller('infopreneur/' + p.id)} className="cursor-pointer transition hover:bg-papier/60">
                <Td><span className="flex items-center gap-3"><Avatar nom={p.nom} sombre={i === 0} /><span className="font-bold">{p.nom}</span></span></Td>
                <Td n>{entier(x.ventes)}</Td>
                <Td n className="text-pierre">{usd(x.part)}</Td>
                <Td n>{usd(x.marge)}</Td>
                <Td n className={s.aPayer ? 'text-vermillon' : '!font-normal text-pierre'}>{s.aPayer ? usd(s.aPayer) : '—'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Apparition>
    </>
  )
}
