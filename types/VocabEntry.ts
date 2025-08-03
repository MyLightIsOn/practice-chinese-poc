// Define a type for the database entries
export interface VocabEntry {
  id: string;
  simplified: string;
  traditional?: string;
  pinyin?: string;
  definition?: string;
  user_id: string;
  created_at: string;
}
