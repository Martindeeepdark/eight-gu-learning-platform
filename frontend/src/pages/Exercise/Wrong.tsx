import { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Pagination, Empty, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { exerciseService } from '../../../services/exercise';
import type { WrongExercise } from '../../../types';

const WrongExercises = () => {
  const [exercises, setExercises] = useState<WrongExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWrongExercises();
  }, [pagination.current, pagination.pageSize]);

  const fetchWrongExercises = async () => {
    setLoading(true);
    try {
      const res = await exerciseService.getWrongList({
        page: pagination.current,
        page_size: pagination.pageSize,
      });
      if (res.code === 0 && res.data) {
        setExercises(res.data.items);
        setPagination({ ...pagination, total: res.data.total });
      }
    } catch (error: any) {
      message.error('获取错题失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const handlePractice = (id: number) => {
    navigate(`/exercises/${id}`);
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
      <h1 style={{ marginBottom: '24px' }}>错题本</h1>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
        ) : exercises.length === 0 ? (
          <Empty description="暂无错题，去练习一下吧" />
        ) : (
          <>
            <List
              dataSource={exercises.map((item) => ({
                ...item,
                key: item.id,
              }))}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => handlePractice(item.id)}>
                      重新练习
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<Tag color="red">题目 #{item.id}</Tag>}
                    description={
                      <div>
                        <div style={{ marginBottom: '12px', fontSize: '16px' }}>
                          {item.question}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <Tag color="orange">你的答案：{item.user_answer}</Tag>
                          <Tag color="green">正确答案：{item.correct_answer}</Tag>
                        </div>
                        <div>
                          <strong>解析：</strong>
                          {item.explanation}
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ color: '#999', fontSize: '12px' }}>
                            错误次数：{item.wrong_count} 次
                          </span>
                        </div>
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
          </>
        )}

        {exercises.length > 0 && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button onClick={() => navigate('/exercises')}>
              去练习新题
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WrongExercises;
