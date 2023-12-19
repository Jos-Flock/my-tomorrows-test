import { Status } from './external-api/status';

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

export type Study = {
  nctId: string;
  briefTitle: string;
  officialTitle: string;
  overallStatus: OVERALL_STATUS | Status;
  briefSummary: string;
  detailedDescription: string;
};
