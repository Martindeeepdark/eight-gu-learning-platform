package config

import (
	"testing"
	"time"
)

func TestLoadConfig(t *testing.T) {
	cfg, err := LoadConfig("dev")
	if err != nil {
		t.Fatalf("Failed to load config: %v", err)
	}

	// 验证服务器配置
	if cfg.Server.Port != 8080 {
		t.Errorf("Expected port 8080, got %d", cfg.Server.Port)
	}

	// 验证数据库配置
	if cfg.Database.DBName != "eightgu" {
		t.Errorf("Expected dbname eightgu, got %s", cfg.Database.DBName)
	}

	// 验证 JWT 配置
	if cfg.JWT.ExpireTime != 168*time.Hour {
		t.Errorf("Expected expire time 168h, got %v", cfg.JWT.ExpireTime)
	}
}

func TestGetDSN(t *testing.T) {
	cfg := DatabaseConfig{
		Host:     "localhost",
		Port:     5432,
		User:     "test",
		Password: "test123",
		DBName:   "testdb",
		SSLMode:  "disable",
	}

	dsn := cfg.GetDSN()
	expected := "host=localhost port=5432 user=test password=test123 dbname=testdb sslmode=disable"
	if dsn != expected {
		t.Errorf("Expected DSN '%s', got '%s'", expected, dsn)
	}
}

func TestGetRedisAddr(t *testing.T) {
	cfg := RedisConfig{
		Host: "localhost",
		Port: 6379,
	}

	addr := cfg.GetRedisAddr()
	expected := "localhost:6379"
	if addr != expected {
		t.Errorf("Expected Redis addr '%s', got '%s'", expected, addr)
	}
}
