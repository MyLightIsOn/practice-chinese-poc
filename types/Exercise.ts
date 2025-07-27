// Define all possible exercise types
export enum ExerciseType {
  FILL_IN_BLANK_WORD = 'Fill in the Blank (Word)',
  // Additional types will be added later
}

// Define the base interface for all exercise templates
export interface ExerciseTemplate {
  type: ExerciseType;
  count: number; // Number of exercises to generate
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
}

// Define the structure for a Fill in the Blank exercise
export interface FillBlankWordExercise {
  id: string;
  prompt: string;       // The sentence with a blank (e.g., "我喜欢吃____。")
  answer: string;       // The correct answer (e.g., "苹果")
  hint?: string;        // Optional hint
  translation?: string; // English translation of the complete sentence
}

// Define the user's response to an exercise
export interface ExerciseResponse {
  exerciseId: string;
  userAnswer: string;
  isCorrect?: boolean;
  feedback?: string;
}

// Define the result of grading an exercise
export interface ExerciseResult {
  exerciseId: string;
  isCorrect: boolean;
  correctAnswer: string;
  feedback?: string;
}

// Define a collection of exercises
export interface ExerciseSet {
  id: string;
  exercises: FillBlankWordExercise[];
  timestamp: number;
  completed?: boolean;
}
