export type VocabEntry = {
  id: string;
  entry_id: number;
  user_id: string;
  simplified: string;
  traditional?: string;
  pinyin?: string;
  definition?: string;
  notes?: string;
  audio_url?: string;
  image_url?: string;
};
