import { HSKLevel } from './HSKLevel';
import { Transcriptions } from './Transcriptions';

export interface DictionaryEntry {
  id: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  definition: string;
  hsk_level: HSKLevel;
  frequency_rank: number;
  radical: string;
  match_type: string;
  relevance_score: number;
  parts_of_speech: string[];
  classifiers: string[];
  transcriptions: Transcriptions;
  meanings: string[];
}
