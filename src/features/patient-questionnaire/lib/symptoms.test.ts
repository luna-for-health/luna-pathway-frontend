import { describe, expect, it } from 'vitest';

import { toSymptomScoresPayload } from '@/features/patient-questionnaire/lib/symptoms';

describe('toSymptomScoresPayload', () => {
  it('maps snake_case ids to the API camelCase fields', () => {
    expect(
      toSymptomScoresPayload({
        dysmenorrhea: 8,
        pelvic_pain: 6,
        dyspareunia: 4,
        digestive_issues: 3,
        urinary_issues: 2,
        fatigue: 1,
      })
    ).toEqual({
      dysmenorrhea: 8,
      pelvicPain: 6,
      dyspareunia: 4,
      digestiveIssues: 3,
      urinaryIssues: 2,
      fatigue: 1,
    });
  });

  it('defaults missing scores to 0', () => {
    expect(toSymptomScoresPayload({ fatigue: 5 })).toEqual({
      dysmenorrhea: 0,
      pelvicPain: 0,
      dyspareunia: 0,
      digestiveIssues: 0,
      urinaryIssues: 0,
      fatigue: 5,
    });
    expect(toSymptomScoresPayload().fatigue).toBe(0);
  });
});
