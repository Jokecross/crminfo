/* Les trois abonnements qu'un infopreneur peut vendre.
   `base44` = la commission reçue par vente (valeurs de démo). */
export const PLANS = [
  { code: 'builder_mensuel', label: 'Builder mensuel', court: 'Builder · mois', prixClient: 50, base44: 250 },
  { code: 'starter_annuel', label: 'Starter annuel', court: 'Starter · an', prixClient: 192, base44: 250 },
  { code: 'builder_annuel', label: 'Builder annuel', court: 'Builder · an', prixClient: 330, base44: 450 },
]
export const PLAN = Object.fromEntries(PLANS.map((p) => [p.code, p]))

/* Le contrat proposé par défaut à un nouvel infopreneur (valeurs de démo). */
export const NIVEAUX_DEPART = [
  { code: 'demarrage', label: 'Démarrage', seuil: 0, grille: { starter_annuel: 200, builder_mensuel: 150, builder_annuel: 300 } },
  { code: 'confirme', label: 'Confirmé', seuil: 30, grille: { starter_annuel: 210, builder_mensuel: 170, builder_annuel: 330 } },
  { code: 'elite', label: 'Élite', seuil: 100, grille: { starter_annuel: 225, builder_mensuel: 190, builder_annuel: 360 } },
]

export const STATUTS = {
  attente: { label: 'En attente', aide: 'Vente reçue, pas encore validée par Base44' },
  validee: { label: 'Validée', aide: 'Validée par Base44 : due au partenaire' },
  annulee: { label: 'Annulée', aide: 'Remboursée ou refusée : rien à payer' },
}
