import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Radio, Button, message, Alert, Space, Progress, Tag, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { exerciseService } from '../../../services/exercise';
import type { Exercise } from '../../../types';

const ExercisePractice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 分钟倒计时

  useEffect(() => {
    if (id) {
      fetchExercise();
    }

    // 倒计时
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [id]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const res = await exerciseService.getById(Number(id));
      if (res.code === 0 && res.data) {
        setExercise(res.data);
      } else {
        message.error(res.message || '获取题目失败');
      }
    } catch (error: any) {
      message.error('获取题目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!exercise || userAnswer.length === 0) {
      message.warning('请选择答案');
      return;
    }

    setSubmitting(true);
    try {
      const res = await exerciseService.submitAnswer(Number(id), userAnswer);
      if (res.code === 0 && res.data) {
        setResult(res.data);
        setAnswered(true);
        
        // 声音或动画
        if (res.data.is_correct) {
          message.success({
            content: '回答正确！太棒了！🎉',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            duration: 3,
          });
        } else {
          message.error({
            content: '回答错误，别灰心，继续努力！💪',
            icon: <CloseCircleOutlined style={{ color: '#f5222d' }} />,
            duration: 3,
          });
        }
      } else {
        message.error(res.message || '提交失败');
      }
    } catch (error: any) {
      message.error('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    // 简单处理：返回列表
    navigate('/exercises');
  };

  const handleRetry = () => {
    setUserAnswer([]);
    setAnswered(false);
    setResult(null);
    setTimeLeft(180);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'blue';
      case 'hard':
        return 'red';
      default:
        return 'default';
    }
  };

  if (loading || !exercise) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip="加载题目中..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>练习题 #{exercise.id}</h1>
          <Tag color={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
          </Tag>
          <Tag color={exercise.type === 'single_choice' ? 'blue' : 'purple'}>
            {exercise.type === 'single_choice' ? '单选题' : '多选题'}
          </Tag>
        </div>
        
        {!answered && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
              <ClockCircleOutlined />
              {formatTime(timeLeft)}
            </div>
            <Progress 
              percent={(180 - timeLeft) / 180 * 100} 
              showInfo={false}
              strokeColor="#faad14"
              style={{ width: '200px' }}
            />
          </div>
        )}
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ fontSize: '18px', lineHeight: '1.6', fontWeight: '500' }}>
            {exercise.question}
          </div>

          {!answered && (
            <Radio.Group
              value={userAnswer}
              onChange={(e) => {
                if (exercise.type === 'single_choice') {
                  setUserAnswer([e.target.value]);
                } else {
                  setUserAnswer(e.target.value);
                }
              }}
              disabled={timeLeft <= 0}
            >
              {JSON.parse(exercise.options).map((option: string, index: number) => (
                <Radio 
                  key={index} 
                  value={option} 
                  style={{ marginBottom: '16px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', display: 'block', fontSize: '16px', transition: 'all 0.2s' }}
                >
                  <span style={{ fontWeight: '500' }}>{String.fromCharCode(65 + index)}.</span>
                  <span style={{ marginLeft: '16px' }}>{option}</span>
                </Radio>
              ))}
            </Radio.Group>
          )}

          {timeLeft <= 0 && !answered && (
            <Alert 
              message="时间到！请提交答案"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {answered && result && (
            <Alert
              message={result.is_correct ? '🎉 回答正确！' : '❌ 回答错误'}
              description={
                <div>
                  <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                    <strong>正确答案：</strong>
                    {JSON.parse(result.correct_answer).map((answer: string, index: number) => (
                      <Tag key={index} color={result.is_correct ? 'green' : 'blue'} style={{ marginBottom: '8px' }}>
                        {answer}
                      </Tag>
                    ))}
                  </div>
                  <div>
                    <strong>解析：</strong>
                    <span style={{ lineHeight: '1.6', fontSize: '15px' }}>
                      {result.explanation}
                    </span>
                  </div>
                </div>
              }
              type={result.is_correct ? 'success' : 'error'}
              showIcon
              style={{ fontSize: '16px' }}
            />
          )}
        </Space>

        {!answered && (
          <div style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleSubmit} 
              loading={submitting}
              block
              style={{ height: '56px', fontSize: '18px', fontWeight: 'bold' }}
              disabled={timeLeft <= 0 || userAnswer.length === 0}
            >
              提交答案
            </Button>
            {userAnswer.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '12px', color: '#999' }}>
                请选择答案后再提交
              </div>
            )}
          </div>
        )}

        {answered && result && (
          <div style={{ marginTop: '32px' }}>
            <Space style={{ width: '100%' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNext}
                style={{ flex: 1, height: '48px', fontSize: '16px' }}
              >
                下一题
              </Button>
              <Button 
                size="large" 
                onClick={handleRetry}
                style={{ flex: 1, height: '48px', fontSize: '16px' }}
              >
                <ReloadOutlined /> 重做
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate('/exercises')}
                style={{ flex: 1, height: '48px', fontSize: '16px' }}
              >
                返回列表
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExercisePractice;
