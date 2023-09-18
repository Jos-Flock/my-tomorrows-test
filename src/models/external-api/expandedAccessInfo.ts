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
import { ExpandedAccessStatus } from './expandedAccessStatus';

export interface ExpandedAccessInfo {
  hasExpandedAccess?: any | null;
  nctId?: any | null;
  statusForNctId?: ExpandedAccessStatus;
}
export namespace ExpandedAccessInfo {}
