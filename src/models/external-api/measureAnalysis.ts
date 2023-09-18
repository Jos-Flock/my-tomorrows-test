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
import { NonInferiorityType } from './nonInferiorityType';
import { AnalysisDispersionType } from './analysisDispersionType';
import { ConfidenceIntervalNumSides } from './confidenceIntervalNumSides';

export interface MeasureAnalysis {
  paramType?: any | null;
  paramValue?: any | null;
  dispersionType?: AnalysisDispersionType;
  dispersionValue?: any | null;
  statisticalMethod?: any | null;
  statisticalComment?: any | null;
  pValue?: any | null;
  pValueComment?: any | null;
  ciNumSides?: ConfidenceIntervalNumSides;
  ciPctValue?: any | null;
  ciLowerLimit?: any | null;
  ciUpperLimit?: any | null;
  ciLowerLimitComment?: any | null;
  ciUpperLimitComment?: any | null;
  estimateComment?: any | null;
  testedNonInferiority?: any | null;
  nonInferiorityType?: NonInferiorityType;
  nonInferiorityComment?: any | null;
  otherAnalysisDescription?: any | null;
  groupDescription?: any | null;
  groupIds?: any | null;
}
export namespace MeasureAnalysis {}