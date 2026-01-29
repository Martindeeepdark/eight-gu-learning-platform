package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWTManager JWT 管理器
type JWTManager struct {
	secret     []byte
	expireTime time.Duration
	issuer     string
}

// Claims JWT Claims
type Claims struct {
	UserID   uint   `json:"user_id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// NewJWTManager 创建 JWT 管理器
func NewJWTManager(secret string, expireTime time.Duration, issuer string) *JWTManager {
	return &JWTManager{
		secret:     []byte(secret),
		expireTime: expireTime,
		issuer:     issuer,
	}
}

// GenerateToken 生成 Token
func (j *JWTManager) GenerateToken(userID uint, email, username string) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID:   userID,
		Email:    email,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    j.issuer,
			Subject:   email,
			ExpiresAt: jwt.NewNumericDate(now.Add(j.expireTime)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(j.secret)
}

// ParseToken 解析 Token
func (j *JWTManager) ParseToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return j.secret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// ValidateToken 验证 Token
func (j *JWTManager) ValidateToken(tokenString string) bool {
	_, err := j.ParseToken(tokenString)
	return err == nil
}

// RefreshToken 刷新 Token
func (j *JWTManager) RefreshToken(tokenString string) (string, error) {
	claims, err := j.ParseToken(tokenString)
	if err != nil {
		return "", err
	}

	// 检查是否即将过期（1天内）
	if time.Until(claims.ExpiresAt.Time) > 24*time.Hour {
		return "", errors.New("token is still valid")
	}

	return j.GenerateToken(claims.UserID, claims.Email, claims.Username)
}
