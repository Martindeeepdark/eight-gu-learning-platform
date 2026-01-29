import { useState, useEffect } from 'react';
import { Card, Tag, Button, Pagination, Radio, List, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, ClockCircleOutlined, TrophyOutlined, FileTextOutlined } from '@ant-design/icons';
import { exerciseService } from '../../../services/exercise';
import type { Exercise } from '../../../types';

const ExerciseList = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ knowledge_id: undefined, difficulty: '' });
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
    fetchCategories();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await exerciseService.getList({
        page: pagination.current,
        page_size: pagination.pageSize,
        ...filters,
      });
      if (res.code === 0 && res.data) {
        setExercises(res.data.items);
        setPagination({ ...pagination, total: res.data.total });
      }
    } catch (error: any) {
      message.error('获取练习题失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await exerciseService.getList({ page: 1, page_size: 100 });
      if (res.code === 0 && res.data) {
        // 从练习题中提取分类（实际应该有专门的分类接口）
        const uniqueCategories = [...new Set(res.data.items.map((e: any) => e.knowledge_point?.category))].filter(Boolean);
        setCategories(uniqueCategories);
      }
    } catch (error: any) {
      console.error('获取分类失败:', error);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
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

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return difficulty;
    }
  };

  const handlePractice = (exercise: any) => {
    navigate(`/exercises/${exercise.id}`);
  };

  const handleWrongExercises = () => {
    navigate('/exercises/wrong');
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>
        练习题库
      </h1>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Radio.Group
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              size="large"
            >
              <Radio.Button value="">全部难度</Radio.Button>
              <Radio.Button value="easy">简单</Radio.Button>
              <Radio.Button value="medium">中等</Radio.Button>
              <Radio.Button value="hard">困难</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Button onClick={handleWrongExercises} size="large" icon={<TrophyOutlined />}>
              查看错题本
            </Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <TrophyOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} spin />
            <div style={{ marginTop: '16px', color: '#999' }}>加载中...</div>
          </div>
        </Card>
      ) : exercises.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <FileTextOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>暂无练习题</div>
            <div style={{ color: '#666' }}>去知识库学习一些知识点，然后回来练习吧</div>
          </div>
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {exercises.map((exercise) => (
              <Col span={8} key={exercise.id} style={{ marginBottom: '16px' }}>
                <Card
                  hoverable
                  onClick={() => handlePractice(exercise)}
                  style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Tag 
                      color={getDifficultyColor(exercise.difficulty)} 
                      style={{ marginBottom: '12px', alignSelf: 'flex-start' }}
                    >
                      {getDifficultyText(exercise.difficulty)}
                    </Tag>
                    
                    <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', flex: 1 }}>
                      题目 #{exercise.id}
                    </div>

                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      marginBottom: '16px',
                      lineHeight: '1.5',
                      color: '#262626',
                    }}>
                      {exercise.question}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BookOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                        <span style={{ color: '#666', fontSize: '14px' }}>
                          {exercise.knowledge_point?.title || '未分类'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ClockCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />
                        <span style={{ color: '#666', fontSize: **14px' }}>
                          约 3 分钟
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    onClick={() => handlePractice(exercise)}
                    style={{ marginTop: 'auto', height: '48px', fontSize: '16px', fontWeight: 'bold' }}
                  >
                    开始答题
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {exercises.length > 0 && (
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              style={{ marginTop: '24px', textAlign: 'center', marginBottom: '32px' }}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['10', '20', '50', '100']}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseList;
