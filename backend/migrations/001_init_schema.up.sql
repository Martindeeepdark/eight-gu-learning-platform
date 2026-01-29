-- 001_init_schema.up.sql
-- 初始化数据库表结构

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON categories(deleted_at);

-- 创建知识点表
CREATE TABLE IF NOT EXISTS knowledge_points (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy','medium','hard')),
    frequency VARCHAR(20) CHECK (frequency IN ('high','medium','low')),
    code_example TEXT,
    references TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_knowledge_points_category_id ON knowledge_points(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_difficulty ON knowledge_points(difficulty);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_frequency ON knowledge_points(frequency);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_deleted_at ON knowledge_points(deleted_at);

-- 创建知识关联表
CREATE TABLE IF NOT EXISTS knowledge_relations (
    id SERIAL PRIMARY KEY,
    from_point_id INTEGER NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
    to_point_id INTEGER NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_knowledge_relations_from_point_id ON knowledge_relations(from_point_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relations_to_point_id ON knowledge_relations(to_point_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relations_relation_type ON knowledge_relations(relation_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_relations_deleted_at ON knowledge_relations(deleted_at);

-- 创建学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    knowledge_point_id INTEGER NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
    mastery_level INTEGER CHECK (mastery_level >= 0 AND mastery_level <= 100) DEFAULT 0,
    last_reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(user_id, knowledge_point_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_knowledge_point_id ON learning_progress(knowledge_point_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_status ON learning_progress(status);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_knowledge ON learning_progress(user_id, knowledge_point_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_deleted_at ON learning_progress(deleted_at);

-- 创建练习题表
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    knowledge_point_id INTEGER NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    answer JSONB NOT NULL,
    type VARCHAR(20) CHECK (type IN ('single_choice','multiple_choice')),
    explanation TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy','medium','hard')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_exercises_knowledge_point_id ON exercises(knowledge_point_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(type);
CREATE INDEX IF NOT EXISTS idx_exercises_deleted_at ON exercises(deleted_at);

-- 创建练习记录表
CREATE TABLE IF NOT EXISTS exercise_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    user_answer JSONB,
    is_correct BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_exercise_records_user_id ON exercise_records(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_records_exercise_id ON exercise_records(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_records_is_correct ON exercise_records(is_correct);
CREATE INDEX IF NOT EXISTS idx_exercise_records_deleted_at ON exercise_records(deleted_at);
