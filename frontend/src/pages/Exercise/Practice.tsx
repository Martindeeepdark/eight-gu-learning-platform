import { useState, useEffect } from 'react';
import { Card, Radio, Button, message, Tag, Space, Alert } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    if (id) {
      fetchExercise();
    }
  }, [id]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const res = await exerciseService.getById(Number(id));
      if (res.code === 0 && res.data) {
        setExercise(res.data);
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
        if (res.data.is_correct) {
          message.success('回答正确！');
        } else {
          message.error('回答错误');
        }
      }
    } catch (error: any) {
      message.error('提交失败');
    } finally {
      setSubmitting(false);
    }
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

  const handleNext = () => {
    // 简单处理：返回列表
    navigate('/exercises');
  };

  if (loading || !exercise) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>练习题 #{exercise.id}</h1>

      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Tag color={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
            </Tag>
            <Tag color={exercise.type === 'single_choice' ? 'blue' : 'purple'}>
              {exercise.type === 'single_choice' ? '单选题' : '多选题'}
            </Tag>
          </div>

          <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
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
            >
              {JSON.parse(exercise.options).map((option: string, index: number) => (
                <Radio key={index} value={option} style={{ marginBottom: '12px', display: 'block' }}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          )}

          {answered && result && (
            <Alert
              message={result.is_correct ? '回答正确' : '回答错误'}
              description={
                <div>
                  <div>正确答案：{JSON.parse(result.correct_answer).join(', ')}</div>
                  <div style={{ marginTop: '12px' }}>
                    <strong>解析：</strong>
                    {result.explanation}
                  </div>
                </div>
              }
              type={result.is_correct ? 'success' : 'error'}
              showIcon
            />
          )}
        </Space>

        {!answered && (
          <div style={{ marginTop: '24px' }}>
            <Button type="primary" size="large" onClick={handleSubmit} loading={submitting} block>
              提交答案
            </Button>
          </div>
        )}

        {answered && (
          <div style={{ marginTop: '24px' }}>
            <Space>
              <Button type="primary" onClick={handleNext}>
                下一题
              </Button>
              <Button onClick={() => setAnswered(false) && setResult(null)}>
                重做
              </Button>
              <Button onClick={() => navigate('/exercises')}>
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
