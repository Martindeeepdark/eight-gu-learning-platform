package service

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/repository"
	"eight-gu-learning-platform/internal/utils"
)

// AuthService 认证服务
type AuthService struct {
	userRepo *repository.UserRepository
	jwtMgr   *utils.JWTManager
}

// NewAuthService 创建认证服务
func NewAuthService(userRepo *repository.UserRepository, jwtMgr *utils.JWTManager) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		jwtMgr:   jwtMgr,
	}
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Username string `json:"username" binding:"required"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse 认证响应
type AuthResponse struct {
	User  *models.User `json:"user"`
	Token string        `json:"token"`
}

// Register 用户注册
func (s *AuthService) Register(req *RegisterRequest) (*AuthResponse, error) {
	// 检查邮箱是否已存在
	if s.userRepo.Exists(req.Email) {
		return nil, utils.ErrEmailAlreadyUsed
	}

	// 加密密码
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// 创建用户
	user := &models.User{
		Email:    req.Email,
		Password: hashedPassword,
		Username: req.Username,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// 生成 Token
	token, err := s.jwtMgr.GenerateToken(user.ID, user.Email, user.Username)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

// Login 用户登录
func (s *AuthService) Login(req *LoginRequest) (*AuthResponse, error) {
	// 获取用户
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, utils.ErrUserNotFound
	}

	// 验证密码
	if !utils.CheckPassword(req.Password, user.Password) {
		return nil, utils.ErrPasswordIncorrect
	}

	// 生成 Token
	token, err := s.jwtMgr.GenerateToken(user.ID, user.Email, user.Username)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

// GetMe 获取当前用户信息
func (s *AuthService) GetMe(userID uint) (*models.User, error) {
	return s.userRepo.GetByID(userID)
}
