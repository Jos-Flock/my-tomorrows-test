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
import { SuggestedSearch } from './suggestedSearch';
import { ProfileResults } from './profileResults';
import { SearchSignals } from './searchSignals';

export interface SearchResult {
  [key: string]: any | any;

  aggFilters?: any | null;
  aggs?: any | null;
  from: any | null;
  hits: any | null;
  limit: any | null;
  profileResults?: ProfileResults;
  signals?: SearchSignals;
  suggestion?: SuggestedSearch;
  total: any | null;
}
