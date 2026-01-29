package utils

import "errors"

var (
	// 用户相关错误
	ErrUserNotFound      = errors.New("用户不存在")
	ErrEmailAlreadyUsed  = errors.New("邮箱已被使用")
	ErrPasswordIncorrect = errors.New("密码错误")

	// 知识点相关错误
	ErrKnowledgeNotFound = errors.New("知识点不存在")
	ErrCategoryNotFound  = errors.New("分类不存在")

	// 学习进度相关错误
	ErrProgressNotFound = errors.New("学习进度不存在")

	// 练习题相关错误
	ErrExerciseNotFound = errors.New("练习题不存在")
	ErrAnswerIncorrect  = errors.New("答案错误")
)

// AppError 应用错误
type AppError struct {
	Code    int
	Message string
	Err     error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Err.Error()
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// NewAppError 创建应用错误
func NewAppError(code int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

// NewParamError 创建参数错误
func NewParamError(message string) *AppError {
	return NewAppError(CodeErrorParam, message, nil)
}

// NewNotFoundError 创建未找到错误
func NewNotFoundError(message string) *AppError {
	return NewAppError(CodeErrorNotFound, message, nil)
}

// NewConflictError 创建冲突错误
func NewConflictError(message string) *AppError {
	return NewAppError(CodeErrorConflict, message, nil)
}

// NewUnauthorizedError 创建未授权错误
func NewUnauthorizedError() *AppError {
	return NewAppError(CodeErrorUnauthorized, "", nil)
}
