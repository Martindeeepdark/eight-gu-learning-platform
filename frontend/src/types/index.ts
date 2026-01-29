// API Response
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// Page Response
export interface PageResponse<T = any> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

// User
export interface User {
  id: number;
  email: string;
  username: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

// Category
export interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  sort_order: number;
  created_at: string;
}

// Knowledge Point
export interface KnowledgePoint {
  id: number;
  title: string;
  description: string;
  content: string;
  category_id: number;
  category?: Category;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: 'high' | 'medium' | 'low';
  code_example: string;
  references: string;
  created_at: string;
  updated_at: string;
}

// Knowledge Graph Node
export interface GraphNode {
  id: string;
  label: string;
  data: {
    id: number;
    title: string;
    difficulty: string;
  };
}

// Knowledge Graph Edge
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
}

// Graph Data
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Learning Progress
export interface LearningProgress {
  id: number;
  user_id: number;
  knowledge_point_id: number;
  knowledge_point?: KnowledgePoint;
  status: 'not_started' | 'in_progress' | 'completed';
  mastery_level: number;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Learning Stats
export interface LearningStats {
  total: number;
  completed: number;
  in_progress: number;
  not_started: number;
  mastery_avg: number;
}

// Exercise
export interface Exercise {
  id: number;
  knowledge_point_id: number;
  question: string;
  options: string[];
  type: 'single_choice' | 'multiple_choice';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

// Exercise Record
export interface ExerciseRecord {
  id: number;
  user_id: number;
  exercise_id: number;
  exercise?: Exercise;
  user_answer: string[];
  is_correct: boolean;
  created_at: string;
}

// Wrong Exercise
export interface WrongExercise {
  id: number;
  question: string;
  user_answer: string;
  correct_answer: string;
  explanation: string;
  wrong_count: number;
}

// Auth Response
export interface AuthResponse {
  user: User;
  token: string;
}
