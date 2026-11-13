import { soldes } from '../lib/calc.js'
import { dateLongue, entier, usd } from '../lib/format.js'
import { Apparition, Avatar, Bouton, EnTete, Pastille, Surtitre } from '../loseless/ui.jsx'
import { Chiffre, Table, Td, Th } from '../blocs.jsx'

export default function Compta({ data, ventes, aller, act }) {
  const lignes = data.partenaires.map((p) => ({ p, s: soldes(p.id, ventes, data.paiements) })).sort((a, z) => z.s.aPayer - a.s.aPayer)
  const total = lignes.reduce((t, l) => ({ aPayer: t.aPayer + l.s.aPayer, attente: t.attente + l.s.attente, paye: t.paye + l.s.paye }), { aPayer: 0, attente: 0, paye: 0 })
  const nb = lignes.filter((l) => l.s.aPayer > 0).length
  const historique = [...data.paiements].sort((a, z) => (a.date < z.date ? 1 : -1))
  const nom = (id) => data.partenaires.find((p) => p.id === id)?.nom || id

  return (
    <>
      <EnTete surtitre="Comptabilité" titre="Les paiements," accent="ce qu’on doit à chacun." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Chiffre i={0} label="À payer maintenant" valeur={total.aPayer} alerte={total.aPayer > 0} aide={`${entier(nb)} infopreneur${nb > 1 ? 's' : ''} · ventes validées par Base44`} />
        <Chiffre i={1} label="En attente de validation" valeur={total.attente} aide="Pas encore dû : ces ventes peuvent être annulées" />
        <Chiffre i={2} label="Déjà payé" valeur={total.paye} aide={`${entier(data.paiements.length)} paiement${data.paiements.length > 1 ? 's' : ''}`} />
      </div>

      <Apparition i={3} className="carte mt-4 overflow-hidden">
        <div className="px-6 pb-2 pt-6 md:px-7"><Surtitre>À régler</Surtitre><div className="mt-1 text-xl font-extrabold tracking-tight">Ce qu’on doit à chacun</div></div>
        <Table>
          <thead><tr><Th>Infopreneur</Th><Th n>Gagné (validé)</Th><Th n>Déjà payé</Th><Th n>On lui doit</Th><Th n>En attente</Th><Th /></tr></thead>
          <tbody>
            {lignes.map(({ p, s }) => (
              <tr key={p.id}>
                <Td><button type="button" onClick={() => aller('infopreneur/' + p.id)} className="flex items-center gap-3 text-left"><Avatar nom={p.nom} /><span className="font-bold underline-offset-4 hover:underline">{p.nom}</span></button></Td>
                <Td n>{usd(s.du)}</Td>
                <Td n className="!font-normal text-pierre">{usd(s.paye)}</Td>
                <Td n className={s.aPayer ? 'text-vermillon' : ''}>{usd(s.aPayer)}</Td>
                <Td n className="!font-normal text-pierre">{usd(s.attente)}</Td>
                <Td className="text-right">{s.aPayer > 0 ? <Bouton taille="sm" onClick={() => act.payer(p.id, s.aPayer)}>Marquer payé</Bouton> : <Pastille ton="plein" icone="coche">À jour</Pastille>}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Apparition>

      <Apparition i={4} className="carte mt-4 overflow-hidden">
        <div className="px-6 pb-2 pt-6 md:px-7"><Surtitre>Historique</Surtitre><div className="mt-1 text-xl font-extrabold tracking-tight">Paiements faits</div></div>
        <Table>
          <thead><tr><Th>Date</Th><Th>Infopreneur</Th><Th n>Montant</Th></tr></thead>
          <tbody>
            {historique.map((x) => <tr key={x.id}><Td>{dateLongue(x.date)}</Td><Td className="font-semibold">{nom(x.partenaireId)}</Td><Td n>{usd(x.montant)}</Td></tr>)}
            {!historique.length && <tr><Td colSpan={3} className="py-10 text-center text-pierre">Aucun paiement.</Td></tr>}
          </tbody>
        </Table>
      </Apparition>
    </>
  )
}
