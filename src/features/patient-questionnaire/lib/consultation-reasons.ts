export interface ConsultationReason {
  id: string;
  title: string;
  description: string;
}

export const CONSULTATION_REASONS: ConsultationReason[] = [
  {
    id: 'diagnostic',
    title: 'Obtenir un diagnostic',
    description: 'J’ai des symptômes et je cherche à comprendre',
  },
  {
    id: 'douleurs',
    title: 'Soulager mes douleurs',
    description: 'Douleurs pelviennes, dysménorrhée, dyspareunie…',
  },
  {
    id: 'projet-grossesse',
    title: 'Mon projet de grossesse',
    description: 'Bilan de fertilité, difficultés à concevoir',
  },
  {
    id: 'second-avis',
    title: 'Demander un second avis',
    description: 'Vérifier un diagnostic ou une indication',
  },
  {
    id: 'suivi',
    title: 'Assurer mon suivi',
    description: 'Endométriose connue, je cherche un référent',
  },
];
