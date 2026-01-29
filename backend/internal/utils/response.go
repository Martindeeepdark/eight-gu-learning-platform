package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response 统一响应格式
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// PageResponse 分页响应格式
type PageResponse struct {
	Total    int         `json:"total"`
	Page     int         `json:"page"`
	PageSize int         `json:"page_size"`
	Items    interface{} `json:"items"`
}

// 成功响应
const (
	CodeSuccess              = 0
	CodeErrorParam           = 1001
	CodeErrorUnauthorized    = 1002
	CodeErrorForbidden       = 1003
	CodeErrorNotFound        = 1004
	CodeErrorConflict        = 1005
	CodeErrorDatabase        = 2001
	CodeErrorCache           = 2002
	CodeErrorInternal        = 3001
)

// 错误消息映射
var errorMessages = map[int]string{
	CodeSuccess:              "success",
	CodeErrorParam:           "参数错误",
	CodeErrorUnauthorized:    "未授权",
	CodeErrorForbidden:       "禁止访问",
	CodeErrorNotFound:        "资源不存在",
	CodeErrorConflict:        "资源已存在",
	CodeErrorDatabase:        "数据库错误",
	CodeErrorCache:           "缓存错误",
	CodeErrorInternal:        "服务器内部错误",
}

// Success 成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: errorMessages[CodeSuccess],
		Data:    data,
	})
}

// SuccessWithMessage 成功响应（带消息）
func SuccessWithMessage(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: message,
		Data:    data,
	})
}

// PageSuccess 分页成功响应
func PageSuccess(c *gin.Context, total, page, pageSize int, items interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: errorMessages[CodeSuccess],
		Data: PageResponse{
			Total:    total,
			Page:     page,
			PageSize: pageSize,
			Items:    items,
		},
	})
}

// Error 错误响应
func Error(c *gin.Context, code int, message string) {
	if message == "" {
		message = errorMessages[code]
	}
	c.JSON(getHTTPStatus(code), Response{
		Code:    code,
		Message: message,
	})
}

// ErrorWithData 错误响应（带数据）
func ErrorWithData(c *gin.Context, code int, message string, data interface{}) {
	if message == "" {
		message = errorMessages[code]
	}
	c.JSON(getHTTPStatus(code), Response{
		Code:    code,
		Message: message,
		Data:    data,
	})
}

// ParamError 参数错误
func ParamError(c *gin.Context, message string) {
	Error(c, CodeErrorParam, message)
}

// UnauthorizedError 未授权
func UnauthorizedError(c *gin.Context) {
	Error(c, CodeErrorUnauthorized, "")
}

// ForbiddenError 禁止访问
func ForbiddenError(c *gin.Context) {
	Error(c, CodeErrorForbidden, "")
}

// NotFoundError 资源不存在
func NotFoundError(c *gin.Context, message string) {
	if message == "" {
		message = errorMessages[CodeErrorNotFound]
	}
	Error(c, CodeErrorNotFound, message)
}

// ConflictError 资源冲突
func ConflictError(c *gin.Context, message string) {
	Error(c, CodeErrorConflict, message)
}

// DatabaseError 数据库错误
func DatabaseError(c *gin.Context, message string) {
	if message == "" {
		message = errorMessages[CodeErrorDatabase]
	}
	Error(c, CodeErrorDatabase, message)
}

// InternalError 服务器内部错误
func InternalError(c *gin.Context, message string) {
	if message == "" {
		message = errorMessages[CodeErrorInternal]
	}
	Error(c, CodeErrorInternal, message)
}

// getHTTPStatus 根据错误码获取 HTTP 状态码
func getHTTPStatus(code int) int {
	switch code {
	case CodeSuccess:
		return http.StatusOK
	case CodeErrorParam, CodeErrorConflict:
		return http.StatusBadRequest
	case CodeErrorUnauthorized:
		return http.StatusUnauthorized
	case CodeErrorForbidden:
		return http.StatusForbidden
	case CodeErrorNotFound:
		return http.StatusNotFound
	case CodeErrorDatabase, CodeErrorCache:
		return http.StatusInternalServerError
	default:
		return http.StatusInternalServerError
	}
}
