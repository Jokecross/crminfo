import { bornes, dans, soldes, totaux } from '../lib/calc.js'
import { entier, moisLong, usd } from '../lib/format.js'
import { Apparition, Avatar, Bouton, EnTete, Icone } from '../loseless/ui.jsx'
import { Table, Td, Th } from '../blocs.jsx'

export default function Infopreneurs({ data, ventes, aujourdhui, aller, ouvrirNouveau }) {
  const b = bornes('mois', aujourdhui)
  const lignes = data.partenaires.map((p) => ({
    p, t: totaux(ventes.filter((v) => v.partenaireId === p.id && dans(v, b))), s: soldes(p.id, ventes, data.paiements),
  })).sort((a, z) => z.t.part - a.t.part)

  return (
    <>
      <EnTete surtitre={`${entier(data.partenaires.length)} infopreneurs · ${moisLong(aujourdhui)}`} titre="Les infopreneurs," accent="un par un.">
        <Bouton icone="plus" onClick={ouvrirNouveau}>Nouvel infopreneur</Bouton>
      </EnTete>
      <Apparition className="carte overflow-hidden">
        <Table>
          <thead><tr><Th>Infopreneur</Th><Th n>Ventes ce mois</Th><Th n>Il a gagné ce mois</Th><Th n>Notre marge ce mois</Th><Th n>On lui doit</Th><Th /></tr></thead>
          <tbody>
            {lignes.map(({ p, t, s }) => (
              <tr key={p.id} onClick={() => aller('infopreneur/' + p.id)} className="group cursor-pointer transition hover:bg-papier/60">
                <Td><span className="flex items-center gap-3"><Avatar nom={p.nom} /><span><span className="block font-bold">{p.nom}</span><span className="block text-xs text-pierre">{[p.langue, p.niche].filter(Boolean).join(' · ')}</span></span></span></Td>
                <Td n>{entier(t.ventes)}</Td>
                <Td n>{usd(t.part)}</Td>
                <Td n>{usd(t.marge)}</Td>
                <Td n className={s.aPayer ? 'text-vermillon' : '!font-normal text-pierre'}>{s.aPayer ? usd(s.aPayer) : '—'}</Td>
                <Td className="w-10 text-pierre"><Icone nom="droite" className="h-4 w-4 transition group-hover:translate-x-1 group-hover:text-vermillon" /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Apparition>
    </>
  )
}
