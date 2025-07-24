import { DictionaryEntry } from './DictionaryEntry';
import { Pagination } from './Pagination';

export interface LookupResponse {
  input_type: "chinese" | "pinyin" | "english";
  results: DictionaryEntry[];
  pagination: Pagination;
}
