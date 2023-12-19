import { internalizeStudy } from '../../clients/study.client';
import { Study } from '../../models/study';
import { Study as ApiStudy } from '../../models/external-api/study';

export const STUDY_JSON = {
  protocolSection: {
    identificationModule: {
      nctId: 'study-nctId',
      briefTitle: 'study-brief-title',
      officialTitle: 'study-official-title',
    },
    statusModule: {
      overallStatus: 'RECRUITING',
    },
    descriptionModule: {
      briefSummary: 'study-brief-summary',
      detailedDescription: 'study-detailed-description',
    },
  },
};

export function createTestStudy(nctId: string | undefined = undefined): ApiStudy {
  return {
    ...STUDY_JSON,
    protocolSection: {
      ...STUDY_JSON.protocolSection,
      identificationModule: {
        ...STUDY_JSON.protocolSection.identificationModule,
        nctId: nctId ?? STUDY_JSON.protocolSection.identificationModule.nctId,
      },
    },
  };
}
