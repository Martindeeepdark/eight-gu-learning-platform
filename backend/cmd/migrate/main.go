package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"eight-gu-learning-platform/internal/config"
	"eight-gu-learning-platform/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	// 解析命令行参数
	env := flag.String("env", "dev", "Environment (dev, prod)")
	action := flag.String("action", "up", "Migration action (up, down)")
	flag.Parse()

	// 加载配置
	cfg, err := config.LoadConfig(*env)
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 连接数据库
	db, err := gorm.Open(postgres.Open(cfg.Database.GetDSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 执行迁移
	switch *action {
	case "up":
		if err := migrateUp(db); err != nil {
			log.Fatalf("Failed to migrate up: %v", err)
		}
		fmt.Println("Migration up completed successfully")
	case "down":
		if err := migrateDown(db); err != nil {
			log.Fatalf("Failed to migrate down: %v", err)
		}
		fmt.Println("Migration down completed successfully")
	default:
		log.Fatalf("Invalid action: %s. Use 'up' or 'down'", *action)
	}
}

// migrateUp 执行向上迁移
func migrateUp(db *gorm.DB) error {
	// 注册所有模型
	models := []interface{}{
		&models.User{},
		&models.Category{},
		&models.KnowledgePoint{},
		&models.KnowledgeRelation{},
		&models.LearningProgress{},
		&models.Exercise{},
		&models.ExerciseRecord{},
	}

	// 自动迁移
	for _, model := range models {
		if err := db.AutoMigrate(model); err != nil {
			return fmt.Errorf("failed to migrate %T: %w", model, err)
		}
	}

	return nil
}

// migrateDown 执行向下迁移
func migrateDown(db *gorm.DB) error {
	// 使用 SQL 文件回滚
	migrationsDir := "migrations"

	// 找到 down 迁移文件
	downFile := filepath.Join(migrationsDir, "001_init_schema.down.sql")
	sql, err := os.ReadFile(downFile)
	if err != nil {
		return fmt.Errorf("failed to read migration file: %w", err)
	}

	// 获取底层 SQL DB
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get database: %w", err)
	}

	// 执行 SQL
	if _, err := sqlDB.Exec(string(sql)); err != nil {
		return fmt.Errorf("failed to execute migration SQL: %w", err)
	}

	return nil
}
