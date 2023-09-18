import {Study} from "../../models/study";

export const STUDY_JSON = {
  protocolSection: {
    identificationModule: {
      nctId: 'study-nctId',
      briefTitle: 'study-brief-title',
      officialTitle: 'study-official-title'
    },
    statusModule: {
      overallStatus: 'RECRUITING'
    },
    descriptionModule: {
      briefSummary: 'study-brief-summary',
      detailedDescription: 'study-detailed-description'
    }
  }
}

export function createTestStudy(nctId: string | undefined = undefined): Study {
  let studyInstance = Study.convertSingle(STUDY_JSON);
  if (nctId !== undefined) {
    studyInstance = {...studyInstance, ...{ nctId } };
  }
  return studyInstance;
}
