/**
 * ClinicalTrials.gov REST API
 * This API is made available to provide users meta data, statistics, and the most recent version of the clinical trials available on ClinicalTrials.gov.
 *
 * The version of the OpenAPI document: 2.0.0-draft
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Status } from './status';
import { ExpandedAccessInfo } from './expandedAccessInfo';
import { DateStruct } from './dateStruct';

export interface StatusModule {
  statusVerifiedDate?: any | null;
  overallStatus?: Status;
  lastKnownStatus?: Status;
  delayedPosting?: any | null;
  whyStopped?: any | null;
  expandedAccessInfo?: ExpandedAccessInfo;
  startDateStruct?: DateStruct;
  primaryCompletionDateStruct?: DateStruct;
  completionDateStruct?: DateStruct;
  studyFirstSubmitDate?: any | null;
  studyFirstSubmitQcDate?: any | null;
  studyFirstPostDateStruct?: DateStruct;
  resultsFirstSubmitDate?: any | null;
  resultsFirstSubmitQcDate?: any | null;
  resultsFirstPostDateStruct?: DateStruct;
  dispFirstSubmitDate?: any | null;
  dispFirstSubmitQcDate?: any | null;
  dispFirstPostDateStruct?: DateStruct;
  lastUpdateSubmitDate?: any | null;
  lastUpdatePostDateStruct?: DateStruct;
}
export namespace StatusModule {}