-- =======================================================
-- SQL Initialization Script for pgAdmin / PostgreSQL
-- Database Name: agricorp_db
-- =======================================================

-- 1. Create Tables

-- Drop tables if already exist (order matters for foreign keys)
DROP TABLE IF EXISTS planted_crops CASCADE;
DROP TABLE IF EXISTS user_farms CASCADE;
DROP TABLE IF EXISTS farms CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    area VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'farmer', -- 'admin' or 'farmer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Farms Table
CREATE TABLE farms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    area_sqm NUMERIC(10, 2) NOT NULL DEFAULT 1600.0,
    area VARCHAR(50) DEFAULT '1600 ตร.ม.',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'alert'
    image VARCHAR(500),
    
    -- Environmental Sensor Data
    env_ph NUMERIC(4, 2) DEFAULT 6.5,
    env_temp NUMERIC(4, 1) DEFAULT 28.0,
    env_humidity NUMERIC(4, 1) DEFAULT 60.0,
    env_ec NUMERIC(4, 2) DEFAULT 1.2,
    env_water NUMERIC(10, 1) DEFAULT 800.0,
    
    -- AI Model Info (Random Forest Recommendation & LSTM Yield)
    reco_model_status VARCHAR(20) DEFAULT 'idle',
    reco_model_accuracy NUMERIC(5, 2) DEFAULT 0.0,
    reco_model_records INT DEFAULT 0,
    reco_model_file VARCHAR(200),
    reco_model_last_trained TIMESTAMP WITH TIME ZONE,
    
    yield_model_status VARCHAR(20) DEFAULT 'idle',
    yield_model_accuracy NUMERIC(5, 2) DEFAULT 0.0,
    yield_model_records INT DEFAULT 0,
    yield_model_file VARCHAR(200),
    yield_model_last_trained TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User-Farms Mapping Table (Many-to-Many assignment)
CREATE TABLE user_farms (
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    farm_id VARCHAR(50) REFERENCES farms(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, farm_id)
);

-- Planted Crops Table
CREATE TABLE planted_crops (
    id VARCHAR(50) PRIMARY KEY,
    farm_id VARCHAR(50) UNIQUE REFERENCES farms(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    crop_icon VARCHAR(50) DEFAULT '🌱',
    color_class VARCHAR(50) DEFAULT 'bg-green-500',
    cycle_days INT DEFAULT 45,
    estimated_yield NUMERIC(10, 2) DEFAULT 0.0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================
-- 2. Seed Initial Mock Data
-- =======================================================

-- Users (admin: 1234, somchai: 123, manee: 456)
INSERT INTO users (id, username, password_hash, first_name, last_name, area, role) VALUES
('admin1', 'admin', '1234', 'ผู้ดูแลระบบ', 'ส่วนกลาง', 'สำนักงานใหญ่', 'admin'),
('f1', 'somchai', '123', 'สมชาย', 'ใจดี', 'เชียงใหม่', 'farmer'),
('f2', 'manee', '456', 'มานี', 'มีตา', 'ขอนแก่น', 'farmer');

-- Farms
INSERT INTO farms (id, name, location, area_sqm, area, status, image, env_ph, env_temp, env_humidity, env_ec, env_water) VALUES
('farm_1', 'แปลงเพาะปลูกที่ 1', 'โซน A', 1600.0, '1600 ตร.ม.', 'active', 'https://picsum.photos/id/15/800/600', 6.5, 28.0, 60.0, 1.2, 800.0),
('farm_2', 'แปลงเพาะปลูกที่ 2', 'โซน B', 1600.0, '1600 ตร.ม.', 'active', 'https://picsum.photos/id/16/800/600', 6.2, 29.5, 65.0, 1.4, 750.0),
('farm_3', 'แปลงเพาะปลูกที่ 3', 'โซน C', 2400.0, '2400 ตร.ม.', 'active', 'https://picsum.photos/id/17/800/600', 7.0, 27.0, 55.0, 1.0, 900.0);

-- Assign farms to Somchai (f1 -> farm_1, farm_2)
INSERT INTO user_farms (user_id, farm_id) VALUES
('f1', 'farm_1'),
('f1', 'farm_2');
