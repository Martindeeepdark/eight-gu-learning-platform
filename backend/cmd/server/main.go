package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"eight-gu-learning-platform/internal/cache"
	"eight-gu-learning-platform/internal/config"
	"eight-gu-learning-platform/internal/database"
	"eight-gu-learning-platform/internal/handler"
	"eight-gu-learning-platform/internal/middleware"
	"eight-gu-learning-platform/internal/repository"
	"eight-gu-learning-platform/internal/service"
	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}

	cfg, err := config.LoadConfig(env)
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化数据库
	db, err := database.NewDB(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.CloseDB(db)

	// 初始化 Redis
	redisClient, err := cache.NewCache(&cfg.Redis)
	if err != nil {
		log.Fatalf("Failed to connect to redis: %v", err)
	}
	defer redisClient.Close()

	// 初始化 JWT Manager
	jwtMgr := utils.NewJWTManager(cfg.JWT.Secret, cfg.JWT.ExpireTime, cfg.JWT.Issuer)

	// 初始化 Repository
	userRepo := repository.NewUserRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	knowledgeRepo := repository.NewKnowledgeRepository(db)
	progressRepo := repository.NewProgressRepository(db)
	exerciseRepo := repository.NewExerciseRepository(db)
	recordRepo := repository.NewRecordRepository(db)
	relationRepo := repository.NewRelationRepository(db)

	// 初始化 Service
	authService := service.NewAuthService(userRepo, jwtMgr)
	userService := service.NewUserService(userRepo)
	knowledgeService := service.NewKnowledgeService(knowledgeRepo, categoryRepo, relationRepo)
	progressService := service.NewProgressService(progressRepo)
	exerciseService := service.NewExerciseService(exerciseRepo, recordRepo)

	// 初始化 Handler
	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userService)
	categoryHandler := handler.NewCategoryHandler(categoryRepo)
	knowledgeHandler := handler.NewKnowledgeHandler(knowledgeService)
	progressHandler := handler.NewProgressHandler(progressService)
	exerciseHandler := handler.NewExerciseHandler(exerciseService)
	healthHandler := handler.NewHealthHandler()

	// 设置 Gin 模式
	if cfg.Server.Mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建路由
	r := gin.New()

	// 全局中间件
	r.Use(middleware.LoggerMiddleware())
	r.Use(middleware.RecoveryMiddleware())
	r.Use(middleware.CORSMiddleware([]string{"*"}))
	r.Use(middleware.RateLimitMiddleware(middleware.NewRateLimiter(time.Minute, 100)))

	// 健康检查
	r.GET("/health", healthHandler.Health)

	// API v1
	v1 := r.Group("/api/v1")
	{
		// 认证路由（无需认证）
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.GET("/me", middleware.AuthMiddleware(jwtMgr), authHandler.GetMe)
		}

		// 用户路由（需要认证）
		users := v1.Group("/users")
		users.Use(middleware.AuthMiddleware(jwtMgr))
		{
			users.GET("/:id", userHandler.GetByID)
			users.PUT("/:id", userHandler.Update)
		}

		// 分类路由（可选认证）
		categories := v1.Group("/categories")
		categories.Use(middleware.OptionalAuthMiddleware(jwtMgr))
		{
			categories.GET("", categoryHandler.List)
			categories.GET("/:id", categoryHandler.GetByID)
		}

		// 知识点路由（需要认证）
		knowledge := v1.Group("/knowledge")
		knowledge.Use(middleware.AuthMiddleware(jwtMgr))
		{
			knowledge.GET("", knowledgeHandler.List)
			knowledge.GET("/:id", knowledgeHandler.GetByID)
			knowledge.GET("/graph", knowledgeHandler.GetGraph)
		}

		// 学习进度路由（需要认证）
		learning := v1.Group("/learning")
		learning.Use(middleware.AuthMiddleware(jwtMgr))
		{
			learning.GET("/progress", progressHandler.GetProgress)
			learning.POST("/progress", progressHandler.UpdateProgress)
			learning.GET("/stats", progressHandler.GetStats)
		}

		// 练习题路由（需要认证）
		exercises := v1.Group("/exercises")
		exercises.Use(middleware.AuthMiddleware(jwtMgr))
		{
			exercises.GET("", exerciseHandler.List)
			exercises.GET("/:id", exerciseHandler.GetByID)
			exercises.POST("/:id/submit", exerciseHandler.SubmitAnswer)
			exercises.GET("/wrong", exerciseHandler.GetWrongList)
		}
	}

	// 创建 HTTP 服务器
	srv := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port),
		Handler:      r,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	// 启动服务器
	go func() {
		log.Printf("Server starting on %s\n", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// 优雅关闭
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}
