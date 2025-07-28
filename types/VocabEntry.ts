export type VocabEntry = {
  user_id: string;
  simplified: string;
  traditional?: string;
  pinyin?: string;
  definition?: string;
  notes?: string;
  audio_url?: string;
  image_url?: string;
  entry_id?: number;
};
