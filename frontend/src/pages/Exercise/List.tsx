import { useState, useEffect } from 'react';
import { Card, Tag, Button, Pagination, Radio, List, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { exerciseService } from '../../services/exercise';
import type { Exercise } from '../../types';

const ExerciseList = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ knowledge_id: undefined, difficulty: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
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

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>练习题</h1>

      <Card style={{ marginBottom: '24px' }}>
        <Radio.Group
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          style={{ marginBottom: '16px' }}
        >
          <Radio.Button value="">全部难度</Radio.Button>
          <Radio.Button value="easy">简单</Radio.Button>
          <Radio.Button value="medium">中等</Radio.Button>
          <Radio.Button value="hard">困难</Radio.Button>
        </Radio.Group>

        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <Button onClick={() => navigate('/exercises/wrong')}>
            查看错题本
          </Button>
        </div>
      </Card>

      <List
        loading={loading}
        dataSource={exercises.map((item) => ({
          ...item,
          key: item.id,
        }))}
        renderItem={(item: any) => (
          <List.Item
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            actions={[
              <Button type="link" onClick={() => navigate(`/exercises/${item.id}`)}>
                开始答题
              </Button>
            ]}
          >
            <List.Item.Meta
              title={`题目 ${item.id}`}
              description={
                <div>
                  <div style={{ marginBottom: '8px' }}>{item.question}</div>
                  <Tag color={getDifficultyColor(item.difficulty)}>
                    {item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                  </Tag>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {exercises.length > 0 && (
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          style={{ marginTop: '24px', textAlign: 'center' }}
        />
      )}
    </div>
  );
};

export default ExerciseList;
