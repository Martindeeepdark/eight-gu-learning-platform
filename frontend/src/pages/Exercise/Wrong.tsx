import { useState, useEffect } from 'react';
import { Card, Button, Pagination, List, Tag, Empty, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TrophyOutlined, CloseCircleOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
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

  const handleDeleteFromWrongBook = async (id: number) => {
    // TODO: 实现从错题本删除功能
    message.success('已从错题本删除');
    // 刷新列表
    fetchWrongExercises();
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>错题本</h1>
        <Button 
          icon={<ReloadOutlined />}
          onClick={fetchWrongExercises}
        >
          刷新
        </Button>
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <TrophyOutlined spin style={{ fontSize: '48px', color: '#1890ff' }} />
            <div style={{ marginTop: '16px', color: '#666' }}>加载中...</div>
          </div>
        ) : exercises.length === 0 ? (
          <Empty
            description="太棒了！你还没有错题，继续保持！"
            image="https://gw.alipayobjects.com/zos/bmwkp7eu%2Fx%2FuM%2Fk%2Fk%2F9s%2Fq%2Fz%2Ft%2Fz%2F%2F%2F1%2Fk%2Fk%2Fv%2F%2Fk%2Fk%2Fk%2Fk%2Fk%2Fk%2Fk%2F9s%2Fq%2Fz%2Ft%2Fz%2Ft%2Fz%2Ft%2Fz%2Ft%2Fz%2Ft%2Fz%2Ft%2Fz%2Ft%2Fz%2Ft%2Fz%2Ft%2Ft%2Ft%2Fz%2Ft%2Ft%2Ft%2Fz%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Fz%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft%2Ft" }}
          />
        )}
      </Empty>
        ) : (
          <List
            dataSource={exercises.map((item) => ({
              ...item,
              key: item.id,
            }))}
            renderItem={(item: any) => (
              <List.Item
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #f0f0f0' }}
                actions={[
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => handlePractice(item.id)}
                  >
                    重新练习
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '8px', 
                      background: '#fff2e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff4d4f',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}>
                      ✕
                    </div>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>题目 #{item.id}</span>
                      <Tag color={getDifficultyColor(item.difficulty)}>
                        {getDifficultyText(item.difficulty)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '16px', lineHeight: '1.6' }}>
                        {item.question}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Tag color="orange" icon={<CloseCircleOutlined />} style={{ marginRight: '8px' }}>
                          你的答案：{item.user_answer}
                        </Tag>
                        <Tag color="green" icon={<FileTextOutlined />}>
                          正确答案：{item.correct_answer}
                        </Tag>
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginBottom: '8px' }}>
                        <strong>解析：</strong>
                        {item.explanation}
                      </div>
                      <div>
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          错误次数：{item.wrong_count} 次
                        </span>
                        <span style={{ marginLeft: '24px', color: '#999', fontSize: '12px' }}>
                          最后错误时间：{new Date().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}

        {exercises.length > 0 && (
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            style={{ marginTop: '24px', textAlign: 'center' }}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['10', '20', '50']}
          />
        )}

        {exercises.length > 0 && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Button onClick={() => navigate('/exercises')} size="large">
              去练习新题
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WrongExercises;
