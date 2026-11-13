import { useState } from 'react'
import { PLANS } from '../lib/reference.js'
import { dateCourte, usd } from '../lib/format.js'
import { Apparition, Avatar, Bouton, EnTete, Presence } from '../loseless/ui.jsx'
import { ModifierContrat, Table, Td, Th } from '../blocs.jsx'

export default function Contrats({ data, aller, act }) {
  const [modifier, setModifier] = useState(null)
  const p = modifier && data.partenaires.find((x) => x.id === modifier)
  return (
    <>
      <EnTete surtitre="Contrats" titre="Ce que chacun touche," accent="et ce qu’il nous reste." />
      <Apparition className="carte overflow-hidden">
        <Table>
          <thead><tr><Th>Infopreneur</Th>{PLANS.map((pl) => <Th key={pl.code} n>{pl.label}</Th>)}<Th>Depuis</Th><Th /></tr></thead>
          <tbody>
            <tr className="bg-papier/60">
              <Td className="text-[13px] font-semibold text-pierre">Base44 nous verse</Td>
              {PLANS.map((pl) => <Td key={pl.code} n className="text-pierre">{usd(pl.base44)}</Td>)}
              <Td /><Td />
            </tr>
            {data.partenaires.map((x) => {
              const c = x.contrats[x.contrats.length - 1]
              return (
                <tr key={x.id}>
                  <Td><button type="button" onClick={() => aller('infopreneur/' + x.id)} className="flex items-center gap-3 text-left"><Avatar nom={x.nom} /><span className="font-bold underline-offset-4 hover:underline">{x.nom}</span></button></Td>
                  {PLANS.map((pl) => <Td key={pl.code} n>{usd(c.grille[pl.code])}<span className="block text-xs font-normal text-pierre">marge {usd(pl.base44 - c.grille[pl.code])}</span></Td>)}
                  <Td className="text-pierre">{dateCourte(c.depuis)}</Td>
                  <Td className="text-right"><Bouton variante="secondaire" taille="sm" icone="modifier" onClick={() => setModifier(x.id)}>Modifier</Bouton></Td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Apparition>
      <Presence>{p && <ModifierContrat p={p} act={act} onFermer={() => setModifier(null)} />}</Presence>
    </>
  )
}
