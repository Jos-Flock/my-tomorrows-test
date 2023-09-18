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
import { InterventionalAssignment } from './interventionalAssignment';
import { ObservationalModel } from './observationalModel';
import { DesignTimePerspective } from './designTimePerspective';
import { MaskingBlock } from './maskingBlock';
import { PrimaryPurpose } from './primaryPurpose';
import { DesignAllocation } from './designAllocation';

export interface DesignInfo {
  allocation?: DesignAllocation;
  interventionModel?: InterventionalAssignment;
  interventionModelDescription?: any | null;
  primaryPurpose?: PrimaryPurpose;
  observationalModel?: ObservationalModel;
  timePerspective?: DesignTimePerspective;
  maskingInfo?: MaskingBlock;
}
export namespace DesignInfo {}