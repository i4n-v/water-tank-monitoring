CREATE DATABASE IF NOT EXISTS water_tank_monitoring;

USE DATABASE water_tank_monitoring;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS water_measurements;

CREATE TABLE IF NOT EXISTS water_measurements (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  total_volume NUMERIC(10, 2) NOT NULL,
  current_volume NUMERIC(10, 2) NOT NULL,
  spent_volume NUMERIC(10, 2) NOT NULL,
  percentage NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);