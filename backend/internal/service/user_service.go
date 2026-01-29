package service

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/repository"
)

// UserService 用户服务
type UserService struct {
	userRepo *repository.UserRepository
}

// NewUserService 创建用户服务
func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

// UpdateUserRequest 更新用户请求
type UpdateUserRequest struct {
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
}

// GetByID 根据 ID 获取用户
func (s *UserService) GetByID(id uint) (*models.User, error) {
	return s.userRepo.GetByID(id)
}

// Update 更新用户信息
func (s *UserService) Update(id uint, req *UpdateUserRequest) (*models.User, error) {
	user, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// 更新字段
	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Avatar != "" {
		user.Avatar = req.Avatar
	}

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

// Delete 删除用户
func (s *UserService) Delete(id uint) error {
	return s.userRepo.Delete(id)
}
