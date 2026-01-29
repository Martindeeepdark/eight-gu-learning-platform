-- 001_init_schema.down.sql
-- 回滚数据库表结构

-- 删除练习记录表
DROP TABLE IF EXISTS exercise_records CASCADE;

-- 删除练习题表
DROP TABLE IF EXISTS exercises CASCADE;

-- 删除学习进度表
DROP TABLE IF EXISTS learning_progress CASCADE;

-- 删除知识关联表
DROP TABLE IF EXISTS knowledge_relations CASCADE;

-- 删除知识点表
DROP TABLE IF EXISTS knowledge_points CASCADE;

-- 删除分类表
DROP TABLE IF EXISTS categories CASCADE;

-- 删除用户表
DROP TABLE IF EXISTS users CASCADE;
