import { Study as ApiStudy } from './external-api/study';
import { IdentificationModule } from './external-api/identificationModule';
import { StatusModule } from './external-api/statusModule';
import { DescriptionModule } from './external-api/descriptionModule';
import { Status } from './external-api/status';

// TODO: Toch een enum van maken?
export type ACTIVE_NOT_RECRUITING = 'ACTIVE_NOT_RECRUITING';
export type COMPLETED = 'COMPLETED';
export type ENROLLING_BY_INVITATION = 'ENROLLING_BY_INVITATION';
export type NOT_YET_RECRUITING = 'NOT_YET_RECRUITING';
export type RECRUITING = 'RECRUITING';
export type SUSPENDED = 'SUSPENDED';
export type TERMINATED = 'TERMINATED';
export type WITHDRAWN = 'WITHDRAWN';
export type AVAILABLE = 'AVAILABLE';
export type NO_LONGER_AVAILABLE = 'NO_LONGER_AVAILABLE';
export type TEMPORARILY_NOT_AVAILABLE = 'TEMPORARILY_NOT_AVAILABLE';
export type APPROVED_FOR_MARKETING = 'APPROVED_FOR_MARKETING';
export type WITHHELD = 'WITHHELD';
export type UNKNOWN = 'UNKNOWN';

export type OVERALL_STATUS =
  | ACTIVE_NOT_RECRUITING
  | COMPLETED
  | ENROLLING_BY_INVITATION
  | NOT_YET_RECRUITING
  | RECRUITING
  | SUSPENDED
  | TERMINATED
  | WITHDRAWN
  | AVAILABLE
  | NO_LONGER_AVAILABLE
  | TEMPORARILY_NOT_AVAILABLE
  | APPROVED_FOR_MARKETING
  | WITHHELD
  | UNKNOWN;

export class Study {
  constructor(
    public nctId: string, // ProtocolSection > IdentificationModule
    public briefTitle: string, // ProtocolSection > IdentificationModule
    public officialTitle: string, // ProtocolSection > IdentificationModule
    public overallStatus: OVERALL_STATUS | Status, // ProtocolSection > StatusModule
    public briefSummary: string, // ProtocolSection > DescriptionModule
    public detailedDescription: string, // ProtocolSection > DescriptionModule
  ) {}

  static convertSingle(apiStudy: ApiStudy): Study {
    const identificationModule: IdentificationModule = apiStudy?.protocolSection
      ?.identificationModule as IdentificationModule;
    const statusModule: StatusModule = apiStudy?.protocolSection?.statusModule as StatusModule;
    const overallStatus: OVERALL_STATUS | Status = statusModule.overallStatus ?? 'UNKNOWN';
    const descriptionModule: DescriptionModule = apiStudy?.protocolSection
      ?.descriptionModule as DescriptionModule;
    return new Study(
      identificationModule.nctId,
      identificationModule.briefTitle,
      identificationModule.officialTitle,
      overallStatus,
      descriptionModule.briefSummary,
      descriptionModule.detailedDescription,
    );
  }

  static convertList(data: ApiStudy[]): Study[] {
    const studyArray: Study[] = [];
    data.forEach(studyData => studyArray.push(Study.convertSingle(studyData)));
    return studyArray;
  }
}
